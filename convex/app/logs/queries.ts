import { query } from "../../_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {
    startDate: v.optional(v.string()), // YYYY-MM-DD
    endDate: v.optional(v.string()),   // YYYY-MM-DD
    limit: v.optional(v.number()),
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 30, 1), 200);

    // Helper to filter by date range
    const inRange = (d: string) => {
      if (args.startDate && d < args.startDate) return false;
      if (args.endDate && d > args.endDate) return false;
      return true;
    };

    let docs: any[] = [];

    if (args.search && args.search.trim().length > 0) {
      const term = args.search.trim();
      const byTitle = await ctx.db
        .query("logs")
        .withSearchIndex("title_search", (q) => q.search("title", term))
        .collect();
      const bySummary = await ctx.db
        .query("logs")
        .withSearchIndex("summary_search", (q) => q.search("summary", term))
        .collect();

      const map = new Map(byTitle.concat(bySummary).map((d) => [d._id, d]));
      docs = Array.from(map.values()).filter((d) => inRange(d.date));
    } else if (args.startDate || args.endDate) {
      // Use index if we can anchor bounds, otherwise scan small set
      if (args.startDate && args.endDate) {
        docs = await ctx.db
          .query("logs")
          .withIndex("by_date", (q) => q.gte("date", args.startDate!).lte("date", args.endDate!))
          .collect();
      } else if (args.startDate) {
        docs = await ctx.db
          .query("logs")
          .withIndex("by_date", (q) => q.gte("date", args.startDate!))
          .collect();
      } else if (args.endDate) {
        // No direct LTE-only bound; collect and filter
        const all = await ctx.db.query("logs").collect();
        docs = all.filter((d) => d.date <= args.endDate!);
      }
    } else {
      // Default: recent by createdAt
      docs = await ctx.db
        .query("logs")
        .withIndex("by_createdAt")
        .collect();
    }

    // Sort by date desc then createdAt desc
    docs.sort((a, b) => {
      if (a.date === b.date) return (b.createdAt ?? 0) - (a.createdAt ?? 0);
      return a.date < b.date ? 1 : -1;
    });

    const sliced = docs.slice(0, limit);
    // Transform to include top-level fields like in the old API
    return sliced.map((log) => {
      const md = (log.metadata as any) || {};
      return {
        id: log._id,
        date: log.date,
        title: log.title ?? null,
        summary: log.summary ?? "",
        bullets: log.bullets ?? [],
        metadata: log.metadata ?? {},
        rawData: log.rawData ?? {},
        createdAt: new Date(log.createdAt).toISOString(),
        haiku: md.haiku ?? null,
        version: md.version ?? log.version ?? 1,
        totalCommits: md.totalCommits ?? 0,
        totalRepos: md.totalRepos ?? 0,
        productivityScore: md.productivityScore ?? 0,
      };
    });
  },
});
