import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const setByKey = mutation({
  args: { key: v.string(), value: v.any() },
  handler: async (ctx, { key, value }) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .collect();
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, { value, updatedAt: Date.now() });
      return existing[0]._id;
    }
    return await ctx.db.insert("settings", { key, value, updatedAt: Date.now() });
  },
});

export const setHeroInstructions = mutation({
  args: { instructions: v.string() },
  handler: async (ctx, { instructions }) => {
    const existing = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "hero_instructions"))
      .collect();
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, { value: instructions, updatedAt: Date.now() });
      return existing[0]._id;
    }
    return await ctx.db.insert("settings", { key: "hero_instructions", value: instructions, updatedAt: Date.now() });
  },
});

// Seed default agent instruction XML into Convex settings so prompts are editable without redeploy.
// Keys used:
// - agents/globalAnalysis
// - agents/codeAnalysis
// - agents/repoContext
// - agents/activitySynthesis
// - agents/prReview
// - agents/technicalDebt
// - agents/commitAnalyzer
// - agents/activitySummarizer
// - agents/repoAnalyzer
import {
  GLOBAL_ANALYSIS_XML,
  CODE_ANALYSIS_XML,
  REPO_CONTEXT_XML,
  ACTIVITY_SYNTHESIS_XML,
  PR_REVIEW_XML,
  TECHNICAL_DEBT_XML,
  COMMIT_ANALYZER_XML,
  ACTIVITY_SUMMARIZER_XML,
  REPO_ANALYZER_XML,
} from "../components/agents/instructions";

export const seedAgentInstructions = mutation({
  args: {},
  handler: async (ctx) => {
    const seeds: Array<[string, string]> = [
      ["agents/globalAnalysis", GLOBAL_ANALYSIS_XML],
      ["agents/codeAnalysis", CODE_ANALYSIS_XML],
      ["agents/repoContext", REPO_CONTEXT_XML],
      ["agents/activitySynthesis", ACTIVITY_SYNTHESIS_XML],
      ["agents/prReview", PR_REVIEW_XML],
      ["agents/technicalDebt", TECHNICAL_DEBT_XML],
      ["agents/commitAnalyzer", COMMIT_ANALYZER_XML],
      ["agents/activitySummarizer", ACTIVITY_SUMMARIZER_XML],
      ["agents/repoAnalyzer", REPO_ANALYZER_XML],
    ];

    let created = 0;
    for (const [key, value] of seeds) {
      const existing = await ctx.db
        .query("settings")
        .withIndex("by_key", (q) => q.eq("key", key))
        .collect();
      if (!existing[0]) {
        await ctx.db.insert("settings", { key, value, updatedAt: Date.now() });
        created++;
      }
    }
    return { created };
  },
});
