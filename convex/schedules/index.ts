import { cronJobs } from "convex/server";
import { internal } from "../_generated/api";

export function buildCrons() {
  const crons = cronJobs();

  // Production: Run analysis at 3:00 UTC
  // Development: Sync from production at 3:30 UTC
  
  // Main daily analysis job (production only, dev skips via ENVIRONMENT check inside the action)
  // Do not compute the date here (cron definitions are static). The action computes 'yesterday' at runtime.
  crons.daily(
    "daily-analysis",
    { hourUTC: 3, minuteUTC: 0 },
    internal.functions.actions.analysis.triggerDailyWorkflow,
    {}
  );

  // Dev sync job - runs 30 minutes after production
  // This job only does something in dev environment
  crons.daily(
    "dev-sync-from-prod",
    { hourUTC: 3, minuteUTC: 30 },
    internal.functions.actions.syncFromProduction.syncLatestAnalysis,
    {}
  );

  return crons;
}
