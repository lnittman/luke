import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  logs: defineTable({
    // YYYY-MM-DD
    date: v.string(),
    logType: v.optional(v.string()),
    title: v.optional(v.string()),
    summary: v.optional(v.string()),
    bullets: v.optional(v.array(v.string())),
    rawData: v.optional(v.any()),
    metadata: v.optional(v.any()),
    processed: v.optional(v.boolean()),
    analysisDepth: v.optional(v.string()),
    version: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_date", ["date"])
    .index("by_createdAt", ["createdAt"])
    .searchIndex("title_search", { searchField: "title" })
    .searchIndex("summary_search", { searchField: "summary" }),

  settings: defineTable({
    key: v.string(),
    value: v.any(),
    updatedAt: v.number(),
  }).index("by_key", ["key"]),

  aiCache: defineTable({
    key: v.string(),
    value: v.any(),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_expires", ["expiresAt"]),

  workflowEvents: defineTable({
    workflowId: v.string(),
    type: v.string(), // "started", "step_completed", "failed", "completed"
    step: v.optional(v.string()),
    details: v.optional(v.any()),
    error: v.optional(v.string()),
    timestamp: v.string(),
    createdAt: v.number(),
  })
    .index("by_workflow", ["workflowId"])
    .index("by_createdAt", ["createdAt"]),
});
