import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { makeRepoSummarizerAgent, makeActivitySummarizerAgent } from "./index";
import { createGlobalAnalysisAgent } from "./global";
import { internal } from "../_generated/api";
import { repoSummaryCache, synthesisCache } from "./llmCache";
import { z } from "zod";
import { globalAnalysisSchema } from "./schema";

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
    // Use tool-less agent for JSON generation
    const agent = await makeRepoSummarizerAgent(ctx as any);
    const { thread } = await agent.createThread(ctx as any, {});
    const threadId = thread.threadId;

    // Calculate commit count from batch analyses
    const commitCount = batchAnalyses.length * 10; // approximate based on batch size

    const summaryPrompt = `IMPORTANT: The analysis is complete. DO NOT call any tools or fetch additional data. Simply summarize the provided narratives into JSON.

Repository: ${repository}
Date: ${date}
Commit Count: ${commitCount}

Completed batch analyses (already inspected commits, PRs, and issues):
${batchAnalyses.join('\n\n---\n\n')}

Your task: Synthesize these narratives into a JSON object with:
- repository: "${repository}"
- commitCount: ${commitCount}
- mainFocus: brief description of main work focus (1 sentence)
- progress: what was accomplished (1 sentence)
- technicalHighlights: array of 2-5 key technical achievements
- concerns: array of 0-3 potential issues or risks identified
- nextSteps: array of 0-3 suggested next actions

CRITICAL: Return ONLY valid JSON. No markdown code blocks, no preamble, no explanations. Just the raw JSON object.`;

    const RepoSummarySchema = z.object({
      repository: z.string(),
      commitCount: z.number(),
      mainFocus: z.string(),
      progress: z.string(),
      technicalHighlights: z.array(z.string()),
      concerns: z.array(z.string()),
      nextSteps: z.array(z.string()),
    });

    try {
      // Use Kumori pattern: saveMessage then generateText
      const saved = await agent.saveMessage(ctx as any, {
        threadId,
        message: { role: 'user', content: summaryPrompt }
      });

      const result = await agent.generateText(ctx as any, { threadId }, { promptMessageId: saved.messageId });
      const text = (result.text ?? "").toString().trim();

      // Parse JSON from text response (Kumori pattern)
      const cleaned = text.replace(/^```json\n?/g, '').replace(/\n?```$/g, '').trim();
      const parsed = JSON.parse(cleaned);

      // Manually validate with Zod
      const validated = RepoSummarySchema.parse(parsed);

      // Include threadId to aid observability
      return { ...validated, threadId, messageCount: batchAnalyses.length + 1 } as any;
    } catch (error) {
      console.error(`[generateRepoSummary] Failed for ${repository}:`, error);
      throw error;
    }
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
    const instructions = await ctx.runQuery(i["app/settings/queries"].getByKey, { key: "agents/globalAnalysis" });
    if (!instructions) {
      throw new Error("Missing settings: agents/globalAnalysis. Seed or set instructions before synthesis.");
    }
    const agent = createGlobalAnalysisAgent(instructions as string, process.env.OPENROUTER_API_KEY);
    const { thread } = await agent.createThread(ctx as any, {});
    const threadId = thread.threadId;

    const prompt = `IMPORTANT: All analysis is complete. DO NOT call any tools or fetch additional data. Simply synthesize the provided data into JSON.

Create a daily development log for ${date} that is concise in narrative (aim 1-3 short paragraphs) but rich in structured metadata.

Statistics:
- Total commits: ${stats.totalCommits}
- Repositories: ${stats.repositories.join(', ')}

Repository summaries (key metadata only):
${repoAnalyses.map((r: any) => `
${r.repository} (${r.commitCount} commits):
- Focus: ${r.mainFocus}
- Progress: ${r.progress}
- Highlights: ${Array.isArray(r.technicalHighlights) && r.technicalHighlights.length ? r.technicalHighlights.join(', ') : 'none'}`).join('\n')}

Cross-Repository:
- Patterns: ${patterns?.patterns?.join(', ') || 'none'}
- Themes: ${patterns?.themes?.join(', ') || 'none'}
- Balance: ${patterns?.balanceAssessment || 'not assessed'}

CRITICAL: Return ONLY valid JSON matching the GlobalAnalysis schema. No markdown code blocks, no preamble, no explanations. Just the raw JSON object.`;

    // Use Kumori pattern: saveMessage then generateText
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
      console.error('[generateGlobalSynthesis] Failed to parse JSON:', text.substring(0, 500));
      throw new Error(`Failed to parse JSON from AI response: ${e}`);
    }

    // Manually validate with Zod
    const validated = (globalAnalysisSchema as any).parse(parsed);

    return { ...validated, threadId } as any;
  },
});

// Cached wrappers moved to functions/internal/cached.ts to avoid circular init
