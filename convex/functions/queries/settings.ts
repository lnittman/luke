import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getByKey = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const [doc] = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", key))
      .collect();
    return doc?.value ?? null;
  },
});

export const getHeroInstructions = query({
  args: {},
  handler: async (ctx) => {
    const [doc] = await ctx.db
      .query("settings")
      .withIndex("by_key", (q) => q.eq("key", "hero_instructions"))
      .collect();
    return (doc?.value as string) ?? "";
  },
});
