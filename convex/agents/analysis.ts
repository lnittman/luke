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
import { batchAnalysisPrompt, patternDetectionPrompt } from "./prompts";

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
    const threadId = thread.threadId;

    for (const [index, batch] of commitBatches.entries()) {
      const [owner, repo] = repository.split('/');

      // Use structured XML prompt
      const prompt = batchAnalysisPrompt({
        repository,
        date,
        batchIndex: index,
        totalBatches: commitBatches.length,
        commits: batch,
        pullRequests,
        issues,
        owner,
        repo
      });

      // Use Kumori pattern: save message first, then generate with promptMessageId
      const saved = await agent.saveMessage(ctx as any, {
        threadId,
        message: { role: 'user', content: prompt }
      });

      const result = await agent.generateText(ctx as any, { threadId }, { promptMessageId: saved.messageId });

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

      // Extract final text
      const finalText = result.text || '';

      console.log(`[RepoAnalyzer] Batch ${index + 1} analysis (${result.steps?.length || 0} steps):`, finalText.substring(0, 200));
      batchAnalyses.push(finalText);
    }

    // Generate final repository summary using Action Retrier + Action Cache wrapper
    console.log(`[RepoAnalyzer] Starting repo summary generation for ${repository}`);
    console.log(`[RepoAnalyzer] Batch analyses count: ${batchAnalyses.length}`);
    console.log(`[RepoAnalyzer] First batch preview:`, batchAnalyses[0]?.substring(0, 200));

    const runId = await retrier.run(
      ctx as any,
      (internal as any).lib.cached.cachedGenerateRepoSummary,
      { repository, date, batchAnalyses, pullRequests, issues }
    );
    console.log(`[RepoAnalyzer] Retrier run ID: ${runId}`);

    const res = await awaitRetrierResult(ctx as any, runId);
    console.log(`[RepoAnalyzer] Retrier result type: ${res.type}`);
    console.log(`[RepoAnalyzer] Retrier full result:`, JSON.stringify(res, null, 2));

    if (res.type === "completed" && (res as any).result.type === "success") {
      console.log(`[RepoAnalyzer] SUCCESS: Repo summary generated for ${repository}`);
      return (res as any).result.returnValue as any;
    }

    // NO FALLBACK - let the error bubble up so we can fix the root cause
    const errorMsg = `Repo summary generation failed for ${repository}: ${JSON.stringify(res)}`;
    console.error(`[RepoAnalyzer] ERROR: ${errorMsg}`);
    throw new Error(errorMsg);
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

    // Use structured XML prompt
    const prompt = patternDetectionPrompt({ date, repoAnalyses });

    const PatternSchema = z.object({
      patterns: z.array(z.string()),
      themes: z.array(z.string()),
      stackTrends: z.array(z.string()),
      methodologyInsights: z.array(z.string()),
      balanceAssessment: z.string()
    });

    try {
      // Use Kumori pattern: saveMessage then generateText
      const threadId = thread.threadId;
      const saved = await agent.saveMessage(ctx as any, {
        threadId,
        message: { role: 'user', content: prompt }
      });

      const result = await agent.generateText(ctx as any, { threadId }, { promptMessageId: saved.messageId });
      const text = (result.text ?? "").toString().trim();

      // Parse JSON from text response (Kumori pattern)
      let parsed;
      try {
        // Remove markdown code blocks if present
        const cleaned = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
        parsed = JSON.parse(cleaned);
      } catch (e) {
        console.error('[detectCrossRepoPatterns] Failed to parse JSON:', text.substring(0, 500));
        throw new Error(`Failed to parse JSON from AI response: ${e}`);
      }

      // Manually validate with Zod and provide defaults
      const validated = PatternSchema.parse({
        patterns: parsed?.patterns || [],
        themes: parsed?.themes || [],
        stackTrends: parsed?.stackTrends || [],
        methodologyInsights: parsed?.methodologyInsights || [],
        balanceAssessment: parsed?.balanceAssessment || ""
      });

      return {
        ...validated,
        threadId: thread.threadId
      };
    } catch (error) {
      console.error(`[detectCrossRepoPatterns] Failed:`, error);
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
    console.log(`[GlobalSynthesis] Starting synthesis for ${date}`);
    console.log(`[GlobalSynthesis] Repo analyses count: ${repoAnalyses.length}`);
    console.log(`[GlobalSynthesis] Stats:`, JSON.stringify(stats, null, 2));

    const runId = await retrier.run(
      ctx as any,
      (internal as any).lib.cached.cachedGenerateGlobalSynthesis,
      { date, repoAnalyses, patterns, stats }
    );
    console.log(`[GlobalSynthesis] Retrier run ID: ${runId}`);

    const res = await awaitRetrierResult(ctx as any, runId);
    console.log(`[GlobalSynthesis] Retrier result type: ${res.type}`);
    console.log(`[GlobalSynthesis] Retrier full result:`, JSON.stringify(res, null, 2));

    if (res.type === "completed" && (res as any).result.type === "success") {
      console.log(`[GlobalSynthesis] SUCCESS: Global synthesis generated for ${date}`);
      return (res as any).result.returnValue as any;
    }

    // NO FALLBACK - let the error bubble up so we can fix the root cause
    const errorMsg = `Global synthesis generation failed for ${date}: ${JSON.stringify(res)}`;
    console.error(`[GlobalSynthesis] ERROR: ${errorMsg}`);
    throw new Error(errorMsg);
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
