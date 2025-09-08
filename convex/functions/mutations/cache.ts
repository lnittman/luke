import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const set = mutation({
  args: { key: v.string(), value: v.any(), ttlMs: v.number() },
  handler: async (ctx, { key, value, ttlMs }) => {
    const now = Date.now();
    const expiresAt = now + Math.max(0, ttlMs);
    const existing = await ctx.db
      .query("aiCache")
      .withIndex("by_key", (q) => q.eq("key", key))
      .collect();
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, { value, expiresAt, createdAt: now });
      return existing[0]._id;
    }
    return await ctx.db.insert("aiCache", { key, value, expiresAt, createdAt: now });
  },
});

