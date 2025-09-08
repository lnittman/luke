import { query } from "../../_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { key: v.string() },
  handler: async (ctx, { key }) => {
    const now = Date.now();
    const [doc] = await ctx.db
      .query("aiCache")
      .withIndex("by_key", (q) => q.eq("key", key))
      .collect();
    if (!doc) return null;
    if (doc.expiresAt <= now) return null;
    return doc.value;
  },
});

