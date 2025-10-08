import { mutation, query } from "../_generated/server";
import { v } from "convex/values";

// Store workflow execution events for observability
export const logWorkflowEvent = mutation({
  args: {
    workflowId: v.string(),
    event: v.object({
      type: v.string(), // "started", "step_completed", "failed", "completed"
      step: v.optional(v.string()),
      details: v.optional(v.any()),
      error: v.optional(v.string()),
      timestamp: v.string(),
    }),
    createdAt: v.optional(v.number()),
  },
  handler: async (ctx, { workflowId, event, createdAt }) => {
    return await ctx.db.insert("workflowEvents", {
      workflowId,
      ...event,
      createdAt: createdAt || Date.now(),
    });
  },
});

// Get all events for a workflow
export const getWorkflowEvents = mutation({
  args: { workflowId: v.string() },
  handler: async (ctx, { workflowId }) => {
    const events = await ctx.db
      .query("workflowEvents")
      .withIndex("by_workflow", (q) => q.eq("workflowId", workflowId))
      .order("asc")
      .collect();

    return events;
  },
});

// Query workflow events
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

// Get all recent workflow events (for debugging)
export const listRecentEvents = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, { limit = 50 }) => {
    const events = await ctx.db
      .query("workflowEvents")
      .withIndex("by_createdAt")
      .order("desc")
      .take(Math.min(Math.max(limit, 1), 500));
    return events;
  },
});
