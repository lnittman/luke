import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Production: Run analysis at midnight UTC
// Development: Sync from production at 00:30 UTC

// Main daily analysis job (production only, dev skips via ENVIRONMENT check inside the action)
// Do not compute the date here (cron definitions are static). The action computes 'yesterday' at runtime.
crons.daily(
  "daily-analysis",
  { hourUTC: 0, minuteUTC: 0 },
  internal.agents.actions.triggerDailyWorkflow,
  {}
);

// Dev sync job - runs 30 minutes after production
// This job only does something in dev environment
crons.daily(
  "dev-sync-from-prod",
  { hourUTC: 0, minuteUTC: 30 },
  internal.syncFromProduction.syncLatestAnalysis,
  {}
);

export default crons;
