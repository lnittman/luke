import { mutation } from "../../_generated/server";
import { v } from "convex/values";
import { api } from "../../_generated/api";

export const storeAnalysis = mutation({
  args: {
    // Subset of the previous Mastra "globalAnalysisSchema"
    date: v.string(), // YYYY-MM-DD
    title: v.string(),
    narrative: v.string(),
    haiku: v.optional(v.string()),
    highlights: v.array(v.string()),
    repoSummaries: v.array(
      v.object({ repository: v.string(), commitCount: v.number(), mainFocus: v.string(), progress: v.string() })
    ),
    metrics: v.object({
      totalCommits: v.number(),
      totalRepos: v.number(),
      primaryLanguages: v.array(v.string()),
      codeQualityTrend: v.string(),
      productivityScore: v.number(),
    }),
    suggestions: v.optional(
      v.array(
        v.object({ id: v.string(), title: v.string(), category: v.string(), priority: v.string() })
      )
    ),
    crossRepoPatterns: v.array(v.string()),
    technicalThemes: v.array(v.string()),
    rawData: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    // Compute version based on existing logs for that date
    const existing = await ctx.db
      .query("logs")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
    const version = existing.length + 1;

    const metadata = {
      totalCommits: args.metrics.totalCommits,
      totalRepos: args.metrics.totalRepos,
      languages: args.metrics.primaryLanguages,
      topProjects: args.repoSummaries.map((r) => r.repository),
      crossRepoPatterns: args.crossRepoPatterns,
      technicalThemes: args.technicalThemes,
      codeQualityTrend: args.metrics.codeQualityTrend,
      productivityScore: args.metrics.productivityScore,
      repoSummaries: args.repoSummaries,
      suggestions: args.suggestions ?? [],
      haiku: args.haiku,
      version,
    };

    const _id = await ctx.db.insert("logs", {
      date: args.date,
      logType: "global",
      title: args.title,
      summary: args.narrative,
      bullets: args.highlights,
      rawData: args.rawData ?? args,
      metadata,
      processed: true,
      analysisDepth: "deep",
      version,
      createdAt: Date.now(),
    });

    return { logId: _id, version, stored: true };
  },
});

export const runDailyAnalysisOnce = mutation({
  args: { date: v.string() }, // YYYY-MM-DD
  handler: async (ctx, { date }): Promise<{ workflowId: string }> => {
    // Schedule the action that will start the workflow
    const scheduledId = await ctx.scheduler.runAfter(
      0, 
      (api as any)["functions/actions/analysis"]["triggerDailyWorkflow"], 
      { date }
    );
    return { workflowId: scheduledId.toString() };
  },
});
