import { query } from "../../_generated/server";
import { v } from "convex/values";

export const getById = query({
  args: { id: v.id("logs") },
  handler: async (ctx, { id }) => {
    const doc = await ctx.db.get(id);
    if (!doc) return null;
    return {
      id: doc._id,
      date: doc.date,
      title: doc.title ?? "",
      summary: doc.summary ?? "",
      bullets: doc.bullets ?? [],
      metadata: doc.metadata ?? {},
      rawData: doc.rawData ?? {},
      createdAt: new Date(doc.createdAt).toISOString(),
    } as const;
  },
});

