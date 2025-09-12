import { internalAction } from "../_generated/server";
import { v } from "convex/values";
import { repoSummaryCache, synthesisCache } from "./llmCache";

export const cachedGenerateRepoSummary: any = internalAction({
  args: {
    repository: v.string(),
    date: v.string(),
    batchAnalyses: v.array(v.string()),
    pullRequests: v.array(v.any()),
    issues: v.array(v.any()),
  },
  handler: async (ctx, args) => {
    return repoSummaryCache.fetch(ctx as any, args);
  },
});

export const cachedGenerateGlobalSynthesis: any = internalAction({
  args: {
    date: v.string(),
    repoAnalyses: v.array(v.any()),
    patterns: v.any(),
    stats: v.object({ totalCommits: v.number(), totalRepos: v.number(), repositories: v.array(v.string()) }),
  },
  handler: async (ctx, args) => {
    return synthesisCache.fetch(ctx as any, args);
  },
});
