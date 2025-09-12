import { action, internalAction } from "../_generated/server";
import { v } from "convex/values";
import { createGlobalAnalysisAgent } from "./definitions/globalAnalysis";
// No embedded fallback — instructions must be present in settings
import { internal } from "../_generated/api";
import { globalAnalysisSchema } from "./analysisSchema";
import { workflow } from "../index";

type Analysis = {
  date: string;
  title: string;
  haiku?: string;
  narrative: string;
  highlights: string[];
  repoSummaries: Array<{ repository: string; commitCount: number; mainFocus: string; progress: string }>;
  crossRepoPatterns: string[];
  technicalThemes: string[];
  suggestions: Array<{
    id: string;
    title: string;
    category: string;
    priority: string;
    estimatedEffort?: string;
    rationale?: string;
    dependencies?: string[];
    prompt?: string;
    contextFiles?: string[];
    relatedCommits?: string[];
  }>;
  metrics: {
    totalCommits: number;
    totalRepos: number;
    primaryLanguages: string[];
    codeQualityTrend: "improving" | "stable" | "declining";
    productivityScore: number;
  };
};

export const generateAnalysis = action({
  args: {
    date: v.string(),
    commits: v.array(
      v.object({ sha: v.string(), message: v.string(), repository: v.string(), timestamp: v.string(), author: v.string(), url: v.string() })
    ),
    pullRequests: v.array(v.any()),
    issues: v.array(v.any()),
    totalCommits: v.number(),
    totalRepos: v.number(),
    repositories: v.array(v.string()),
  },
  handler: async (_ctx, input): Promise<Analysis> => {
    // Load from Convex settings; if missing, fail gracefully (no embedded fallback)
    const i = internal as any;
    const instructions = await _ctx.runQuery(i.settings.queries.getByKey, {
      key: "agents/globalAnalysis",
    });
    if (!instructions) {
      throw new Error("Missing settings: agents/globalAnalysis. Seed or set instructions before running analysis.");
    }

    // Get API key from Convex environment
    const apiKey = process.env.OPENROUTER_API_KEY;
    const agent = createGlobalAnalysisAgent(instructions as string, apiKey);
    const { thread } = await agent.createThread(_ctx as any, {});
    const res = await thread.generateObject({
      schema: globalAnalysisSchema,
      prompt: `Analyze this GitHub activity for ${input.date} and create a comprehensive daily log.\n\nActivity data:\n${JSON.stringify(
        {
          date: input.date,
          activity: {
            commits: input.commits.slice(0, 100),
            pullRequests: input.pullRequests,
            issues: input.issues,
          },
          stats: {
            totalCommits: input.totalCommits,
            totalRepos: input.totalRepos,
            repositories: input.repositories,
          },
        },
        null,
        2,
      )}\n\nReturn ONLY JSON matching the provided schema. No prose.`,
    });
    if (!res?.object) throw new Error("Agent did not return structured output");
    return res.object as any;
  },
});

export const triggerDailyWorkflow = internalAction({
  args: { date: v.optional(v.string()) }, // YYYY-MM-DD (optional; defaults to yesterday UTC)
  handler: async (ctx, { date }): Promise<{ workflowId: string }> => {
    // Skip execution in development to avoid duplicate OpenRouter costs
    // In dev, use scripts/sync-prod-to-dev.sh to copy production data
    if (process.env.ENVIRONMENT === "development") {
      console.log("Skipping daily workflow in development environment");
      return { workflowId: "skipped-dev" };
    }
    
    // Compute target date if not provided (yesterday in UTC)
    const targetDate = (() => {
      if (date) return date;
      const now = new Date();
      const y = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const yyyy = y.getUTCFullYear();
      const mm = String(y.getUTCMonth() + 1).padStart(2, '0');
      const dd = String(y.getUTCDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    })();

    // Generate a simple tracking ID (avoid Date.now()/Math.random() inside workflows; ok here in action)
    const trackingId = `wf_${targetDate}_${Math.random().toString(36).slice(2, 8)}`;
    
    const workflowId: string = await workflow.start(
      ctx,
      // Switch to the agentic workflow for fine-grained processing
      internal.workflows.definitions.agenticDailyAnalysis.agenticDailyAnalysis,
      { date: targetDate, workflowId: trackingId }
    );
    return { workflowId };
  },
});
