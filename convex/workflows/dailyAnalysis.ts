import { v } from "convex/values";
import { workflow } from "../index";
import { internal } from "../_generated/api";

// IMPORTANT: This is a workflow definition, not a mutation.
// It should only be called via workflow.start(), not directly.
// If you see errors about invalid arguments, check that nothing is calling this directly.

export const dailyAnalysis = workflow.define({
  args: { date: v.string(), workflowId: v.optional(v.string()) },
  handler: async (step, { date, workflowId }): Promise<{ logId: any; version: number; stored: boolean; steps?: any }> => {
    const i = internal as any;
    const steps: any[] = [];
    
    // Use the provided workflow ID
    const wfId = workflowId || `wf_${date}`;
    
    // Counter for timestamps (workflows can't use Date.now())
    let stepCounter = 0;
    const getTimestamp = () => `${date}T00:${String(stepCounter++).padStart(2, '0')}:00.000Z`;
    
    try {
      // Log workflow start
      await step.runMutation(i.functions.mutations.workflowTracking.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "started",
          details: { date },
          timestamp: getTimestamp(),
        },
      });
      
      // Step 1: Fetch GitHub activity
      console.log(`[Workflow ${wfId}] Starting daily analysis for ${date}`);
      steps.push({ step: "fetch_activity", status: "started", timestamp: getTimestamp() });
      
      await step.runMutation(i.functions.mutations.workflowTracking.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_started",
          step: "fetch_activity",
          timestamp: getTimestamp(),
        },
      });
      
      const activity = await step.runAction(i.functions.actions.github.fetchDailyActivity, { date });
      
      steps.push({ 
        step: "fetch_activity", 
        status: "completed", 
        timestamp: getTimestamp(),
        details: { 
          commits: activity.commits?.length || 0,
          repos: activity.repositories?.length || 0
        }
      });
      
      await step.runMutation(i.functions.mutations.workflowTracking.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_completed",
          step: "fetch_activity",
          details: { 
            commits: activity.commits?.length || 0,
            repos: activity.repositories?.length || 0
          },
          timestamp: getTimestamp(),
        },
      });
      
      console.log(`[Workflow ${wfId}] Fetched ${activity.commits?.length || 0} commits from ${activity.repositories?.length || 0} repos`);

      // Step 2: Generate AI analysis
      steps.push({ step: "generate_analysis", status: "started", timestamp: getTimestamp() });
      
      await step.runMutation(i.functions.mutations.workflowTracking.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_started",
          step: "generate_analysis",
          timestamp: getTimestamp(),
        },
      });
      
      const analysis = await step.runAction(i.functions.actions.analysis.generateAnalysis, {
        date,
        ...activity,
      });
      
      steps.push({ 
        step: "generate_analysis", 
        status: "completed", 
        timestamp: getTimestamp(),
        details: { title: analysis.title }
      });
      
      await step.runMutation(i.functions.mutations.workflowTracking.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_completed",
          step: "generate_analysis",
          details: { title: analysis.title },
          timestamp: getTimestamp(),
        },
      });
      
      console.log(`[Workflow ${wfId}] Generated analysis: ${analysis.title}`);

      // Step 3: Store the analysis
      steps.push({ step: "store_analysis", status: "started", timestamp: getTimestamp() });
      
      await step.runMutation(i.functions.mutations.workflowTracking.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_started",
          step: "store_analysis",
          timestamp: getTimestamp(),
        },
      });
      
      const result = await step.runMutation(i.functions.mutations.logs.storeAnalysis, {
        ...analysis,
        rawData: { activity, workflowSteps: steps, workflowId: wfId },
      });
      
      steps.push({ 
        step: "store_analysis", 
        status: "completed", 
        timestamp: getTimestamp(),
        details: { logId: result.logId }
      });
      
      await step.runMutation(i.functions.mutations.workflowTracking.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_completed",
          step: "store_analysis",
          details: { logId: result.logId },
          timestamp: getTimestamp(),
        },
      });
      
      await step.runMutation(i.functions.mutations.workflowTracking.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "completed",
          details: { logId: result.logId, totalSteps: steps.length },
          timestamp: getTimestamp(),
        },
      });
      
      console.log(`[Workflow ${wfId}] Stored analysis with ID: ${result.logId}`);
      
      return { ...result, steps, workflowId: wfId };
    } catch (error) {
      console.error(`[Workflow ${wfId}] Error in daily analysis:`, error);
      steps.push({ 
        step: "error", 
        status: "failed", 
        timestamp: getTimestamp(),
        error: String(error)
      });
      
      await step.runMutation(i.functions.mutations.workflowTracking.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "failed",
          error: String(error),
          details: { steps },
          timestamp: getTimestamp(),
        },
      });
      
      throw error;
    }
  },
});