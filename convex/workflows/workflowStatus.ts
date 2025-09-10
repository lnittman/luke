import { query } from "../_generated/server";
import { v } from "convex/values";
import { components } from "../_generated/api";

// Query to get workflow status and details
export const getWorkflowStatus = query({
  args: { workflowId: v.string() },
  handler: async (ctx, { workflowId }) => {
    // Use the workflow component to get status
    const status = await ctx.runQuery(
      components.workflow.workflow.getStatus as any,
      { workflowId }
    );
    
    return status;
  },
});

// Query to get workflow journal (detailed logs)
export const getWorkflowJournal = query({
  args: { workflowId: v.string() },
  handler: async (ctx, { workflowId }) => {
    // Use the workflow component to get journal entries
    const journal = await ctx.runQuery(
      components.workflow.journal.load as any,
      { workflowId }
    );
    
    return journal;
  },
});

// Query to list recent workflows
export const listRecentWorkflows = query({
  args: { 
    limit: v.optional(v.number()),
  },
  handler: async (ctx, { limit = 10 }) => {
    // Query the workflows table directly
    const workflows = await ctx.db
      .query("workflows" as any)
      .order("desc")
      .take(limit);
    
    return workflows;
  },
});