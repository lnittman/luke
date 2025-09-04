import { cronJobs } from "convex/server";
import { internal } from "../_generated/api";

export function buildCrons() {
  const crons = cronJobs();

  // Daily at 03:00 UTC: run daily analysis for yesterday
  crons.daily(
    "daily-analysis",
    { hourUTC: 3, minuteUTC: 0 },
    internal.workflows.dailyAnalysis.dailyAnalysis,
    {
      date: new Date(Date.now() - 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    }
  );

  return crons;
}

