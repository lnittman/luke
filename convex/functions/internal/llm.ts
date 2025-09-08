import { internalAction } from "../../_generated/server";
import { v } from "convex/values";
import { makeRepoAnalyzerAgent, makeActivitySummarizerAgent } from "../../agents/githubAgents";
import { createGlobalAnalysisAgent } from "../../agents/globalAnalysis";
import { internal } from "../../_generated/api";
import { repoSummaryCache, synthesisCache } from "../../lib/llmCache";
import { z } from "zod";
import { globalAnalysisSchema } from "../../lib/analysisSchema";

// Compute-only action: generates a repository summary object (no caching here)
export const generateRepoSummary = internalAction({
  args: {
    repository: v.string(),
    date: v.string(),
    batchAnalyses: v.array(v.string()),
    pullRequests: v.array(v.any()),
    issues: v.array(v.any()),
  },
  handler: async (ctx, { repository, date, batchAnalyses, pullRequests, issues }) => {
    const agent = await makeRepoAnalyzerAgent(ctx as any);
    const { thread } = await agent.createThread(ctx as any, {});
    const summaryPrompt = `\nUsing tool results (commit diffs, PR files) and the batch narratives below, produce a strict JSON repository summary for ${repository} on ${date}.\n\nRepository facts:\n- Commits analyzed: ${batchAnalyses.join('').length ? 'unknown' : 'unknown'}\n\nBatch narratives:\n${batchAnalyses.join('\n---\n')}\n\nReturn ONLY JSON and match this schema exactly:\n{\n  "repository": "string",\n  "commitCount": number,\n  "mainFocus": "string",\n  "progress": "string",\n  "technicalHighlights": string[],\n  "concerns": string[],\n  "nextSteps": string[]\n}\n`;
    const RepoSummarySchema = z.object({
      repository: z.string(),
      commitCount: z.number(),
      mainFocus: z.string(),
      progress: z.string(),
      technicalHighlights: z.array(z.string()).optional().default([]),
      concerns: z.array(z.string()).optional().default([]),
      nextSteps: z.array(z.string()).optional().default([]),
      stats: z.object({ totalAdditions: z.number(), totalDeletions: z.number(), filesChanged: z.number() }).optional(),
    });
    const result = await thread.generateObject({ prompt: summaryPrompt, schema: RepoSummarySchema as any });
    // Include threadId to aid observability
    return { ...result.object, threadId: (thread as any).threadId, messageCount: batchAnalyses.length + 1 } as any;
  },
});

// Compute-only action: generates the global synthesis object (no caching here)
export const generateGlobalSynthesis = internalAction({
  args: {
    date: v.string(),
    repoAnalyses: v.array(v.any()),
    patterns: v.any(),
    stats: v.object({ totalCommits: v.number(), totalRepos: v.number(), repositories: v.array(v.string()) }),
  },
  handler: async (ctx, { date, repoAnalyses, patterns, stats }) => {
    const i = internal as any;
    const instructions = await ctx.runQuery(i.functions.queries.settings.getByKey, { key: "agents/globalAnalysis" });
    if (!instructions) {
      throw new Error("Missing settings: agents/globalAnalysis. Seed or set instructions before synthesis.");
    }
    const agent = createGlobalAnalysisAgent(instructions as string, process.env.OPENROUTER_API_KEY);
    const { thread } = await agent.createThread(ctx as any, {});
    const prompt = `\nCreate a daily development log for ${date} that is concise in narrative (aim 1-3 short paragraphs) but rich in structured metadata.\n\nStatistics:\n- Total commits: ${stats.totalCommits}\n- Repositories: ${stats.repositories.join(', ')}\n\nRepository summaries (key metadata only):\n${repoAnalyses.map((r: any) => `\n${r.repository} (${r.commitCount} commits):\n- Focus: ${r.mainFocus}\n- Progress: ${r.progress}\n- Highlights: ${Array.isArray(r.technicalHighlights) && r.technicalHighlights.length ? r.technicalHighlights.join(', ') : 'none'}`).join('\n')}\n\nCross-Repository:\n- Patterns: ${patterns?.patterns?.join(', ') || 'none'}\n- Themes: ${patterns?.themes?.join(', ') || 'none'}\n- Balance: ${patterns?.balanceAssessment || 'not assessed'}\n\nReturn ONLY JSON matching the provided schema. No additional prose.`;
    const result = await thread.generateObject({ prompt, schema: globalAnalysisSchema as any });
    return { ...result.object, threadId: (thread as any).threadId } as any;
  },
});

// Cached wrappers moved to functions/internal/cached.ts to avoid circular init
