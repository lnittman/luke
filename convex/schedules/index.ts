import { cronJobs } from "convex/server";
import { internal } from "../_generated/api";

export function buildCrons() {
  const crons = cronJobs();

  // Daily at 03:00 UTC: run daily analysis for yesterday
  // Note: Cron jobs can't directly call workflows, so we trigger via action
  crons.daily(
    "daily-analysis",
    { hourUTC: 3, minuteUTC: 0 },
    internal.functions.actions.analysis.triggerDailyWorkflow,
    {
      date: new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    }
  );

  return crons;
}

