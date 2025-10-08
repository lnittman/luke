import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import {
  makeRepoAnalyzerAgent,
  makePatternDetectorAgent,
  makeCommitAnalyzerAgent
} from "./index";
import { createGlobalAnalysisAgent } from "./global";
import { globalAnalysisSchema } from "./schema";
import { internal } from "../_generated/api";
import { z } from "zod";
import { retrier } from "../index";
import { stepCountIs } from "ai";

// Analyze a single repository with its commits
export const analyzeRepository = internalAction({
  args: {
    repository: v.string(),
    commitBatches: v.array(v.array(v.object({
      sha: v.string(),
      message: v.string(),
      repository: v.string(),
      timestamp: v.string(),
      author: v.string(),
      url: v.string()
    }))),
    date: v.string(),
    pullRequests: v.array(v.any()),
    issues: v.array(v.any())
  },
  handler: async (ctx, { repository, commitBatches, date, pullRequests, issues }) => {
    console.log(`[RepoAnalyzer] Analyzing ${repository} with ${commitBatches.flat().length} commits`);

    // Create a repository analyzer agent
    const agent = await makeRepoAnalyzerAgent(ctx);

    // Create a thread for this repository analysis
    const { thread } = await agent.createThread(ctx as any, {});

    // Analyze commits in batches with deep inspection
    const batchAnalyses = [];
    for (const [index, batch] of commitBatches.entries()) {
      const [owner, repo] = repository.split('/');
      const prompt = `Analyze Luke's work in ${repository} on ${date}. Batch ${index + 1}/${commitBatches.length}.

CRITICAL: You MUST use fetchCommitDetailsTool for each commit to see actual file changes.

Commits to analyze:
${batch.map(c => `- ${c.sha.substring(0, 7)}: ${c.message}`).join('\n')}

${pullRequests.length > 0 ? `Related PRs:\n${pullRequests.map((pr: any) => `- #${pr.number}: ${pr.title}`).join('\n')}` : ''}

${issues.length > 0 ? `Related issues:\n${issues.map((issue: any) => `- #${issue.number}: ${issue.title}`).join('\n')}` : ''}

Instructions:
1. Call fetchCommitDetailsTool({ owner: "${owner}", repo: "${repo}", sha: "COMMIT_SHA" }) for EACH commit above
2. Analyze what Luke actually built/changed (files, lines, patterns)
3. Identify technical decisions and architectural choices
4. Note any risks, quality concerns, or interesting patterns

Write a bespoke 2-3 sentence narrative about what Luke accomplished in this batch. Be specific about the actual work, not generic. Reference file types, architectural changes, or technical decisions when relevant.`;

      const result = await thread.generateText({
        prompt,
        stopWhen: stepCountIs(15) // Allow up to 15 steps for multi-step tool calling
      });

      // Debug: log the entire result structure
      console.log(`[RepoAnalyzer] Batch ${index + 1} result:`, JSON.stringify({
        text: result.text?.substring(0, 100),
        textLength: result.text?.length,
        stepsCount: result.steps?.length,
        finishReason: result.finishReason,
        toolCallsCount: result.toolCalls?.length,
        toolResultsCount: result.toolResults?.length,
        lastStepText: result.steps?.[result.steps.length - 1]?.text?.substring(0, 100)
      }, null, 2));

      // Extract final text - could be in result.text or last step
      const finalText = result.text || result.steps?.[result.steps.length - 1]?.text || '';

      console.log(`[RepoAnalyzer] Batch ${index + 1} analysis (${result.steps?.length || 0} steps):`, finalText.substring(0, 200));
      batchAnalyses.push(finalText);
    }

    // Generate final repository summary using Action Retrier + Action Cache wrapper
    try {
      const runId = await retrier.run(
        ctx as any,
        (internal as any).lib.cached.cachedGenerateRepoSummary,
        { repository, date, batchAnalyses, pullRequests, issues }
      );
      const res = await awaitRetrierResult(ctx as any, runId);
      if (res.type === "completed" && (res as any).result.type === "success") {
        return (res as any).result.returnValue as any;
      }
      throw new Error(`Repo summary run failed: ${JSON.stringify(res)}`);
    } catch (err) {
        console.warn(`[RepoAnalyzer] Fallback summary for ${repository}:`, err);
        const commitCount = commitBatches.flat().length;
        return {
          repository,
          commitCount,
          mainFocus: 'updates and fixes',
          progress: `landed ${commitCount} commits`,
          technicalHighlights: [],
          concerns: [],
          nextSteps: [],
          threadId: thread.threadId, // Include threadId for observability even in fallback
          messageCount: batchAnalyses.length + 1
        } as any;
    }
  }
});

// Detect patterns across repositories
export const detectCrossRepoPatterns = internalAction({
  args: {
    repoAnalyses: v.array(v.any()),
    date: v.string()
  },
  handler: async (ctx, { repoAnalyses, date }) => {
    console.log(`[PatternDetector] Analyzing patterns across ${repoAnalyses.length} repositories`);

    // Use tool-less agent for JSON generation (generateObject doesn't support tools)
    const agent = await makePatternDetectorAgent(ctx);

    // Create a thread for pattern detection
    const { thread } = await agent.createThread(ctx as any, {});

    const prompt = `Analyze development patterns across ${repoAnalyses.length} repositories on ${date}.

Repository summaries:
${repoAnalyses.map(r => `
${r.repository}:
- Focus: ${r.mainFocus}
- Progress: ${r.progress}
- Highlights: ${r.technicalHighlights?.join(', ') || 'none'}
- Concerns: ${r.concerns?.join(', ') || 'none'}
`).join('\n')}

Generate a JSON object identifying:
- patterns: array of 0-5 cross-repository patterns observed
- themes: array of 0-5 technical themes (e.g., "API development", "testing")
- stackTrends: array of 0-3 technology trends
- methodologyInsights: array of 0-3 process observations
- balanceAssessment: brief text describing work distribution

Return ONLY valid JSON. No markdown formatting, no explanations outside the JSON.

Example format:
{
  "patterns": ["pattern 1", "pattern 2"],
  "themes": ["theme 1"],
  "stackTrends": [],
  "methodologyInsights": [],
  "balanceAssessment": "work focused on repo X"
}`;

    const PatternSchema = z.object({
      patterns: z.array(z.string()),
      themes: z.array(z.string()),
      stackTrends: z.array(z.string()),
      methodologyInsights: z.array(z.string()),
      balanceAssessment: z.string()
    });

    try {
      // Use no-schema mode to avoid Azure strict validation issues
      const result = await thread.generateObject({
        prompt,
        output: "no-schema" as any
      });

      // Manually validate with Zod and provide defaults
      const obj = result.object as any;
      const validated = PatternSchema.parse({
        patterns: obj?.patterns || [],
        themes: obj?.themes || [],
        stackTrends: obj?.stackTrends || [],
        methodologyInsights: obj?.methodologyInsights || [],
        balanceAssessment: obj?.balanceAssessment || ""
      });

      return {
        ...validated,
        threadId: thread.threadId
      };
    } catch (error) {
      console.error(`[detectCrossRepoPatterns] Failed:`, error);
      // Try to get raw response for debugging
      const textResult = await thread.generateText({ prompt }).catch(() => ({ text: '' }));
      console.error(`[detectCrossRepoPatterns] Raw AI response:`, textResult.text?.substring(0, 500));
      throw error;
    }
  }
});

// Generate final global synthesis
export const generateGlobalSynthesis = internalAction({
  args: {
    date: v.string(),
    repoAnalyses: v.array(v.any()),
    patterns: v.any(),
    stats: v.object({
      totalCommits: v.number(),
      totalRepos: v.number(),
      repositories: v.array(v.string())
    })
  },
  handler: async (ctx, { date, repoAnalyses, patterns, stats }) => {
    console.log(`[GlobalSynthesis] Creating final synthesis for ${date}`);

    // Load instructions from settings or use default
    const i = internal as any;
    const instructions = await ctx.runQuery(i["app/settings/queries"].getByKey, {
      key: "agents/globalAnalysis",
    });
    if (!instructions) {
      throw new Error("Missing settings: agents/globalAnalysis. Seed or set instructions before running synthesis.");
    }

    // Create global analysis agent
    const agent = createGlobalAnalysisAgent(instructions as string, process.env.OPENROUTER_API_KEY);

    // Create thread for global synthesis
    const { thread } = await agent.createThread(ctx as any, {});

    const prompt = `
Create a daily development log for ${date} that is concise in narrative (aim 1-3 short paragraphs) but rich in structured metadata.

Statistics:
- Total commits: ${stats.totalCommits}
- Repositories: ${stats.repositories.join(', ')}

Repository summaries (key metadata only):
${repoAnalyses.map(r => `
${r.repository} (${r.commitCount} commits):
- Focus: ${r.mainFocus}
- Progress: ${r.progress}
- Highlights: ${Array.isArray(r.technicalHighlights) && r.technicalHighlights.length ? r.technicalHighlights.join(', ') : 'none'}
${r.stats ? `- Stats: +${r.stats.totalAdditions}/-${r.stats.totalDeletions}, files: ${r.stats.filesChanged}` : ''}
`).join('\n')}

Cross-Repository:
- Patterns: ${patterns.patterns?.join(', ') || 'none'}
- Themes: ${patterns.themes?.join(', ') || 'none'}
- Balance: ${patterns.balanceAssessment || 'not assessed'}

Requirements:
- Provide engaging title
- Narrative summary (concise)
- Highlights (bulleted, crisp)
- Technical themes & patterns (from inputs)
- Suggestions (actionable, prioritized)
- Metrics (totals + productivity score)
- Optional haiku

Return ONLY JSON matching the provided schema. No additional prose.
`;

    // Primary: structured generation with Action Retrier + Action Cache wrapper
    try {
      const runId = await retrier.run(
        ctx as any,
        (internal as any).lib.cached.cachedGenerateGlobalSynthesis,
        { date, repoAnalyses, patterns, stats }
      );
      const res = await awaitRetrierResult(ctx as any, runId);
      if (res.type === "completed" && (res as any).result.type === "success") {
        return (res as any).result.returnValue as any;
      }
      throw new Error(`Synthesis run failed: ${JSON.stringify(res)}`);
    } catch (err) {
        // Fallback: build a minimal but valid object and validate
        console.warn("[GlobalSynthesis] Structured generation failed, using fallback:", err);
        const primaryRepoSummaries = (repoAnalyses || []).map((r: any) => ({
          repository: r.repository,
          commitCount: Number(r.commitCount || 0),
          mainFocus: String(r.mainFocus || "Updates"),
          progress: String(r.progress || "Progress recorded"),
        }));
        const highlights: string[] = [];
        for (const r of primaryRepoSummaries.slice(0, 8)) {
          highlights.push(`${r.repository}: ${r.commitCount} commits — ${r.mainFocus}`);
        }
        const productivityScore = Math.max(1, Math.min(10, Math.round((stats.totalCommits || 0) / 10)));
        const fallback = {
          date,
          title: `Daily work • ${stats.totalCommits} commits across ${stats.totalRepos} repos`,
          haiku: undefined,
          narrative: `Worked across ${stats.totalRepos} repositories with ${stats.totalCommits} commits. Key repos show momentum with meaningful progress. Cross-repo themes were identified to guide next steps.`,
          highlights,
          repoSummaries: primaryRepoSummaries,
          crossRepoPatterns: (patterns?.patterns as string[]) || [],
          technicalThemes: (patterns?.themes as string[]) || [],
          suggestions: [],
          metrics: {
            totalCommits: stats.totalCommits || 0,
            totalRepos: stats.totalRepos || 0,
            primaryLanguages: [],
            codeQualityTrend: "stable" as const,
            productivityScore,
          },
        };
        const parsed = (globalAnalysisSchema as any).parse(fallback);
        return { ...parsed, threadId: thread.threadId };
    }
  }
});

async function awaitRetrierResult(ctx: any, runId: string) {
  // Poll retrier status until completion; small backoff
  for (let i = 0; i < 60; i++) {
    const status = await retrier.status(ctx, runId as any);
    if (status.type === "completed") return status;
    await new Promise((r) => setTimeout(r, Math.min(250 * (i + 1), 2000)));
  }
  throw new Error("Action retrier timed out waiting for completion");
}
