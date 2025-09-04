import { v } from "convex/values";
import { workflow } from "../index";
import { internal } from "../_generated/api";

export const dailyAnalysis = workflow.define({
  args: { date: v.string() },
  handler: async (step, { date }): Promise<{ logId: any; version: number; stored: boolean }> => {
    const i = internal as any;
    const activity = await step.runAction(i.functions.actions.github.fetchDailyActivity, { date });

    const analysis = await step.runAction(i.functions.actions.analysis.generateAnalysis, {
      date,
      ...activity,
    });

    const result = await step.runMutation(i.functions.mutations.logs.storeAnalysis, {
      ...analysis,
      rawData: { activity },
    });
    return result;
  },
});
