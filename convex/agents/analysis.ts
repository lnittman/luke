import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import {
  makeRepoAnalyzerAgent,
  makeActivitySummarizerAgent,
  makeCommitAnalyzerAgent
} from "./index";
import { createGlobalAnalysisAgent } from "./global";
import { globalAnalysisSchema } from "./schema";
import { internal } from "../_generated/api";
import { z } from "zod";
import { retrier } from "../index";

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

    // Analyze commits in batches to avoid overwhelming the agent
    const batchAnalyses = [];
    for (const [index, batch] of commitBatches.entries()) {
      const prompt = `
You are analyzing repository ${repository}. This is batch ${index + 1}/${commitBatches.length} for ${date}.

Tool discipline:
- For each commit, call fetchCommitDetailsTool({ owner, repo, sha }) to retrieve files and change stats (no patch text). Use owner="${repository.split('/')[0]}", repo="${repository.split('/')[1]}".
- If a pull request seems related, call getPullRequestFilesTool({ owner, repo, number }) to inspect changed files (no patches). Do not guess.

Synthesize this batch: major changes, architectural implications, risks, progress signals. Keep it concise.

Commits:
${batch.map(c => `- ${c.sha.substring(0, 7)}: ${c.message}`).join('\n')}

${pullRequests.length > 0 ? `Related Pull Requests:\n${pullRequests.map((pr: any) => `- #${pr.number}: ${pr.title} (${pr.state})`).join('\n')}` : ''}

${issues.length > 0 ? `Related Issues:\n${issues.map((issue: any) => `- #${issue.number}: ${issue.title} (${issue.state})`).join('\n')}` : ''}
`;

      const result = await thread.generateText({
        prompt: `${prompt}\n\nOutput constraints:\n- Keep the narrative under 700 characters.\n- Do not include code or diffs.\n- Focus on concrete, high-signal observations only.`
      });

      batchAnalyses.push(result.text);
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

    // Create activity summarizer agent for pattern detection
    const agent = await makeActivitySummarizerAgent(ctx);

    // Create a thread for pattern detection
    const { thread } = await agent.createThread(ctx as any, {});

    const prompt = `
Analyze activity patterns across ${repoAnalyses.length} repositories on ${date}.

Repository summaries:
${repoAnalyses.map(r => `
${r.repository}:
- Focus: ${r.mainFocus}
- Progress: ${r.progress}
- Highlights: ${r.technicalHighlights?.join(', ') || 'none'}
- Concerns: ${r.concerns?.join(', ') || 'none'}
`).join('\n')}

Identify:
1. Cross-repository patterns and themes
2. Technology stack trends
3. Development methodology patterns
4. Areas of focus vs areas neglected
5. Overall productivity indicators

Return JSON:
{
  "patterns": ["pattern descriptions"],
  "themes": ["technical themes"],
  "stackTrends": ["technology trends"],
  "methodologyInsights": ["process observations"],
  "balanceAssessment": "how work is distributed"
}
`;

    const PatternSchema = z.object({
      patterns: z.array(z.string()),
      themes: z.array(z.string()),
      stackTrends: z.array(z.string()).optional().default([]),
      methodologyInsights: z.array(z.string()).optional().default([]),
      balanceAssessment: z.string().optional().default("")
    });
    const result = await thread.generateObject({
      prompt,
      schema: PatternSchema
    });

    return {
      ...result.object,
      threadId: thread.threadId
    };
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
