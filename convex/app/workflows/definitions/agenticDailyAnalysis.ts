import { v } from "convex/values";
import { workflow } from "../../../index";
import { internal } from "../../../_generated/api";

// Fine-grained agentic workflow with full observability
export const agenticDailyAnalysis = workflow.define({
  args: { 
    date: v.string(), 
    workflowId: v.optional(v.string()) 
  },
  handler: async (step, { date, workflowId }): Promise<{
    logId: any;
    version: number;
    stored: boolean;
    agentThreads: any[];
    workflowId: string;
  }> => {
    const i = internal as any;
    const wfId = workflowId || `wf_${date}`;
    
    // Track all agent threads for observability
    const agentThreads: any[] = [];
    
    // Counter for timestamps (workflows can't use Date.now())
    let stepCounter = 0;
    const getTimestamp = () => `${date}T00:${String(stepCounter++).padStart(2, '0')}:00.000Z`;
    
    try {
      // Log workflow start
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "started",
          details: { date },
          timestamp: getTimestamp(),
        },
      });
      
      // =====================================
      // Step 1: Fetch and Group GitHub Activity
      // =====================================
      console.log(`[Workflow ${wfId}] Step 1: Fetching GitHub activity`);
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_started",
          step: "fetch_github_activity",
          timestamp: getTimestamp(),
        },
      });
      
      const activity = await step.runAction(i.github.actions.fetchDailyActivity, { date });
      
      // Group commits by repository
      const commitsByRepo = new Map<string, any[]>();
      for (const commit of activity.commits || []) {
        if (!commitsByRepo.has(commit.repository)) {
          commitsByRepo.set(commit.repository, []);
        }
        commitsByRepo.get(commit.repository)!.push(commit);
      }
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_completed",
          step: "fetch_github_activity",
          details: { 
            totalCommits: activity.commits?.length || 0,
            totalRepos: commitsByRepo.size,
            repositories: Array.from(commitsByRepo.keys())
          },
          timestamp: getTimestamp(),
        },
      });
      
      // =====================================
      // Step 2: Parallel Per-Repository Analysis
      // =====================================
      // Analyze all repositories (no max). Sort by descending commit count for faster ROI.
      const selected = Array.from(commitsByRepo.entries()).sort((a, b) => b[1].length - a[1].length);
      console.log(`[Workflow ${wfId}] Step 2: Analyzing ${selected.length} repositories`);
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_started",
          step: "repository_analysis",
          details: { repositories: selected.map(([name, items]) => ({ name, commits: items.length })) },
          timestamp: getTimestamp(),
        },
      });
      
      // Analyze repositories sequentially for resilience (and to log per-repo errors)
      const repoAnalyses: any[] = [];
      for (const [repo, commits] of selected) {
        const batchSize = 10;
        const batches = [] as any[];
        for (let i = 0; i < commits.length; i += batchSize) {
          batches.push(commits.slice(i, i + batchSize));
        }
        try {
          const result = await step.runAction(
            i.agents.agentAnalysis.analyzeRepository,
            { 
              repository: repo, 
              commitBatches: batches,
              date,
              pullRequests: activity.pullRequests?.filter((pr: any) => pr.repository === repo) || [],
              issues: activity.issues?.filter((issue: any) => issue.repository === repo) || []
            },
            { name: `analyze_${repo.replace(/[\/\-]/g, '_')}` }
          );
          repoAnalyses.push(result);
        } catch (e) {
          await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
            workflowId: wfId,
            event: { type: "step_completed", step: `repository_analysis:${repo}`, details: { error: String(e) }, timestamp: getTimestamp() },
          });
        }
      }
      
      // Collect all agent thread IDs
      repoAnalyses.forEach(analysis => {
        if (analysis.threadId) {
          agentThreads.push({
            type: "repository",
            repository: analysis.repository,
            threadId: analysis.threadId,
            timestamp: getTimestamp()
          });
        }
      });
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_completed",
          step: "repository_analysis",
          details: { 
            analyzedRepos: repoAnalyses.length,
            agentThreads: agentThreads.filter(t => t.type === "repository").map(t => t.threadId)
          },
          timestamp: getTimestamp(),
        },
      });
      
      // =====================================
      // Step 3: Cross-Repository Pattern Detection
      // =====================================
      console.log(`[Workflow ${wfId}] Step 3: Detecting cross-repository patterns`);
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_started",
          step: "pattern_detection",
          timestamp: getTimestamp(),
        },
      });
      
      let patterns: any = { patterns: [], themes: [], stackTrends: [], methodologyInsights: [], balanceAssessment: "" };
      try {
        patterns = await step.runAction(
          i.agents.agentAnalysis.detectCrossRepoPatterns,
          { repoAnalyses, date }
        );
      } catch (e) {
        await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
          workflowId: wfId,
          event: { type: "step_completed", step: "pattern_detection", details: { error: String(e) }, timestamp: getTimestamp() },
        });
      }
      
      if (patterns.threadId) {
        agentThreads.push({
          type: "pattern_detection",
          threadId: patterns.threadId,
          timestamp: getTimestamp()
        });
      }
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_completed",
          step: "pattern_detection",
          details: { 
            patternsFound: patterns.patterns?.length || 0,
            threadId: patterns.threadId
          },
          timestamp: getTimestamp(),
        },
      });
      
      // =====================================
      // Step 4: Global Synthesis
      // =====================================
      console.log(`[Workflow ${wfId}] Step 4: Generating global synthesis`);
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_started",
          step: "global_synthesis",
          timestamp: getTimestamp(),
        },
      });
      
      // Prepare compact repo summaries (only key metadata)
      const compactRepoSummaries = repoAnalyses.map((r: any) => ({
        repository: r.repository,
        commitCount: r.commitCount,
        mainFocus: r.mainFocus,
        progress: r.progress,
        technicalHighlights: Array.isArray(r.technicalHighlights) ? r.technicalHighlights.slice(0, 5) : [],
        concerns: Array.isArray(r.concerns) ? r.concerns.slice(0, 3) : [],
        nextSteps: Array.isArray(r.nextSteps) ? r.nextSteps.slice(0, 3) : [],
        stats: r.stats || undefined,
      }));

      const synthesis = await step.runAction(
        i.agents.agentAnalysis.generateGlobalSynthesis,
        {
          date,
          repoAnalyses: compactRepoSummaries,
          patterns,
          stats: {
            totalCommits: activity.totalCommits,
            totalRepos: activity.totalRepos,
            repositories: activity.repositories
          }
        }
      );
      
      if (synthesis.threadId) {
        agentThreads.push({
          type: "global_synthesis",
          threadId: synthesis.threadId,
          timestamp: getTimestamp()
        });
      }
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_completed",
          step: "global_synthesis",
          details: { 
            title: synthesis.title,
            threadId: synthesis.threadId
          },
          timestamp: getTimestamp(),
        },
      });
      
      // =====================================
      // Step 5: Store Analysis with Full Observability
      // =====================================
      console.log(`[Workflow ${wfId}] Step 5: Storing analysis with observability data`);
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_started",
          step: "store_analysis",
          timestamp: getTimestamp(),
        },
      });
      
      const { threadId: _synthThread, ...synthOut } = synthesis as any;
      const result = await step.runMutation(i.logs.mutations.storeAnalysis, {
        ...synthOut,
        rawData: {
          stats: {
            totalCommits: activity.totalCommits,
            totalRepos: activity.totalRepos,
            repositories: activity.repositories,
          },
          repoSummaries: compactRepoSummaries,
          patterns: { patterns: patterns.patterns || [], themes: patterns.themes || [] },
          workflowId: wfId,
          agentThreads,
        },
      });
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "step_completed",
          step: "store_analysis",
          details: { logId: result.logId },
          timestamp: getTimestamp(),
        },
      });
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "completed",
          details: { 
            logId: result.logId, 
            totalAgentThreads: agentThreads.length,
            agentTypes: [...new Set(agentThreads.map(t => t.type))]
          },
          timestamp: getTimestamp(),
        },
      });
      
      console.log(`[Workflow ${wfId}] Completed with ${agentThreads.length} agent threads`);
      
      return { 
        ...result, 
        agentThreads,
        workflowId: wfId 
      };
      
    } catch (error) {
      console.error(`[Workflow ${wfId}] Error in agentic daily analysis:`, error);
      
      await step.runMutation(i.workflows.mutations.logWorkflowEvent, {
        workflowId: wfId,
        event: {
          type: "failed",
          error: String(error),
          details: { agentThreads },
          timestamp: getTimestamp(),
        },
      });
      
      throw error;
    }
  },
});
