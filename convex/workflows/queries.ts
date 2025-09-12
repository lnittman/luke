import { query } from "../_generated/server";
import { v } from "convex/values";

export const listEvents = query({
  args: { workflowId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { workflowId, limit = 500 }) => {
    const events = await ctx.db
      .query("workflowEvents")
      .withIndex("by_workflow", (q) => q.eq("workflowId", workflowId))
      .order("asc")
      .take(Math.min(Math.max(limit, 1), 2000));
    return events;
  },
});

