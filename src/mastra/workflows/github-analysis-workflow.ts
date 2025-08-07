import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { 
  codeAnalysisAgent,
  repoContextAgent,
  activitySynthesisAgent,
  prReviewAgent,
  technicalDebtAgent,
  createCustomAgent,
} from '../agents/code-analysis-agents';
import { 
  db, 
  repositories,
  analysisRules,
  activityLogsExtended,
  activityDetailsExtended,
  userPreferences,
} from '@/lib/db';
import { eq, and, inArray } from 'drizzle-orm';

// Step 1: Load configuration and rules
const loadConfigurationStep = createStep({
  id: 'load-configuration',
  description: 'Load user preferences, repositories, and analysis rules',
  inputSchema: z.object({
    username: z.string(),
    date: z.string(),
  }),
  outputSchema: z.object({
    repositories: z.array(z.any()),
    rules: z.array(z.any()),
    preferences: z.any(),
  }),
  execute: async ({ inputData }) => {
    // Load user preferences
    const [userPref] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, inputData.username))
      .limit(1);

    // Load active repositories
    const repos = await db
      .select()
      .from(repositories)
      .where(eq(repositories.analysisEnabled, true));

    // Load analysis rules for all repositories
    const repoIds = repos.map(r => r.id);
    const rules = repoIds.length > 0 
      ? await db
          .select()
          .from(analysisRules)
          .where(
            and(
              inArray(analysisRules.repositoryId, repoIds),
              eq(analysisRules.enabled, true)
            )
          )
          .orderBy(analysisRules.priority)
      : [];

    return {
      repositories: repos,
      rules,
      preferences: userPref || {
        defaultAnalysisDepth: 'deep',
        focusAreas: ['architecture', 'performance', 'security'],
        aiVerbosity: 'detailed',
      },
    };
  },
});

// Step 2: Gather repository context
const gatherContextStep = createStep({
  id: 'gather-context',
  description: 'Gather deep context about each repository',
  inputSchema: z.object({
    repositories: z.array(z.any()),
    rules: z.array(z.any()),
    preferences: z.any(),
  }),
  outputSchema: z.object({
    repoContexts: z.array(z.any()),
  }),
  execute: async ({ inputData }) => {
    const contexts = [];

    for (const repo of inputData.repositories) {
      const response = await repoContextAgent.generate([{
        role: 'user',
        content: `Analyze the repository ${repo.fullName} and provide deep architectural context.
        Focus on: ${inputData.preferences.focusAreas.join(', ')}
        Analysis depth: ${repo.analysisDepth || inputData.preferences.defaultAnalysisDepth}`,
      }], {
        toolChoice: 'required',
      });

      contexts.push({
        repository: repo,
        context: response,
      });
    }

    return { repoContexts: contexts };
  },
});

// Step 3: Fetch and analyze activity
const fetchActivityStep = createStep({
  id: 'fetch-activity',
  description: 'Fetch GitHub activity across all repositories',
  inputSchema: z.object({
    repoContexts: z.array(z.any()),
  }),
  outputSchema: z.object({
    activities: z.array(z.any()),
  }),
  execute: async ({ inputData, getInitData }) => {
    const activities = [];
    const initData = getInitData();
    const { username, date } = initData;

    // Extract repositories from repoContexts
    const repositories = inputData.repoContexts.map(ctx => ctx.repository);

    // Fetch activity for the user
    const stream = await activitySynthesisAgent.streamVNext([{
      role: 'user',
      content: `Fetch all GitHub activity for user ${username} on ${date}.
      Include activity from these repositories: ${repositories.map(r => r.fullName).join(', ')}
      Use the fetch-user-activity tool to get comprehensive data.`,
    }], {
      toolChoice: 'required',
    });

    // Parse and structure the activity data
    const toolResults = await stream.toolResults;
    const rawActivity = toolResults?.[0]?.result || {};
    
    activities.push({
      username: username,
      date: date,
      raw: rawActivity,
    });

    return { activities };
  },
});

// Step 4: Deep code analysis
const analyzeCodeStep = createStep({
  id: 'analyze-code',
  description: 'Perform deep code analysis on commits and PRs',
  inputSchema: z.object({
    activities: z.array(z.any()),
    repositories: z.array(z.any()),
    rules: z.array(z.any()),
  }),
  outputSchema: z.object({
    codeAnalysis: z.array(z.any()),
  }),
  execute: async ({ inputData }) => {
    const analyses = [];

    for (const activity of inputData.activities) {
      const commits = activity.raw.commits || [];
      const pullRequests = activity.raw.pullRequests || [];

      // Analyze each commit with deep dive
      for (const commit of commits.slice(0, 10)) { // Limit to top 10 for performance
        if (commit.sha) {
          const stream = await codeAnalysisAgent.streamVNext([{
            role: 'user',
            content: `Perform deep technical analysis of commit ${commit.sha}.
            Repository context: ${JSON.stringify(inputData.repositories)}
            Apply these rules: ${inputData.rules.map(r => r.ruleContent).join('; ')}
            
            Focus on:
            1. Code quality and complexity changes
            2. Design patterns and architectural impact
            3. Security implications
            4. Performance considerations
            5. Technical debt introduced or resolved
            
            Use analyzeCommitDiffTool and detectCodePatternsTool for comprehensive analysis.
            Include specific file paths and line numbers.`,
          }], {
            toolChoice: 'required',
          });
          
          const toolResults = await stream.toolResults;

          analyses.push({
            type: 'commit',
            sha: commit.sha,
            analysis: toolResults,
          });
        }
      }

      // Analyze PRs with review insights
      for (const pr of pullRequests.slice(0, 5)) { // Limit for performance
        if (pr.number) {
          const stream = await prReviewAgent.streamVNext([{
            role: 'user',
            content: `Perform comprehensive review of PR #${pr.number} in ${pr.base?.repo?.full_name}.
            Apply custom rules: ${inputData.rules.filter(r => r.applyTo.pullRequests).map(r => r.ruleContent).join('; ')}
            
            Use analyzePullRequestTool for detailed analysis.
            Include review feedback, code quality assessment, and impact analysis.`,
          }], {
            toolChoice: 'required',
          });

          const toolResults = await stream.toolResults;

          analyses.push({
            type: 'pr',
            number: pr.number,
            analysis: toolResults,
          });
        }
      }
    }

    return { codeAnalysis: analyses };
  },
});

// Step 5: Track technical debt
const trackDebtStep = createStep({
  id: 'track-debt',
  description: 'Analyze technical debt changes',
  inputSchema: z.object({
    codeAnalysis: z.array(z.any()),
    repositories: z.array(z.any()),
  }),
  outputSchema: z.object({
    debtAnalysis: z.any(),
  }),
  execute: async ({ inputData }) => {
    const response = await technicalDebtAgent.generate([{
      role: 'user',
      content: `Analyze technical debt across all code changes. 
      
      Code analyses: ${JSON.stringify(inputData.codeAnalysis)}
      Repositories: ${inputData.repositories.map(r => r.fullName).join(', ')}
      
      Provide:
      1. Debt added today (with specific locations)
      2. Debt resolved today (with evidence)
      3. Overall debt score change
      4. Priority items to address
      5. Debt trends and velocity
      
      Use specific file:line references and GitHub permalinks.`,
    }]);

    return { debtAnalysis: response };
  },
});

// Step 6: Generate comprehensive report
const generateReportStep = createStep({
  id: 'generate-report',
  description: 'Synthesize all analysis into a comprehensive report',
  inputSchema: z.object({
    activities: z.array(z.any()),
    repoContexts: z.array(z.any()),
    codeAnalysis: z.array(z.any()),
    debtAnalysis: z.any(),
    rules: z.array(z.any()),
    preferences: z.any(),
  }),
  outputSchema: z.object({
    report: z.object({
      summary: z.string(),
      technicalSummary: z.string(),
      bullets: z.array(z.string()),
      insights: z.any(),
      metrics: z.any(),
      details: z.array(z.any()),
    }),
  }),
  execute: async ({ inputData }) => {
    // Create custom agent if rules exist
    const customRules = inputData.rules.filter(r => r.ruleType === 'prompt').map(r => r.ruleContent);
    const focusAreas = inputData.preferences.focusAreas || [];
    
    const synthesisAgent = customRules.length > 0 
      ? createCustomAgent(customRules, focusAreas)
      : activitySynthesisAgent;

    const response = await synthesisAgent.generate([{
      role: 'user',
      content: `Create a comprehensive daily activity report.
      
      Activities: ${JSON.stringify(inputData.activities)}
      Repository Contexts: ${JSON.stringify(inputData.repoContexts)}
      Code Analyses: ${JSON.stringify(inputData.codeAnalysis)}
      Technical Debt: ${JSON.stringify(inputData.debtAnalysis)}
      
      Requirements:
      1. Executive summary (2-3 sentences capturing the essence of the day)
      2. Technical summary (deeper technical narrative)
      3. Key achievements (10-15 bullets with GitHub links)
      4. Structured insights:
         - Code quality changes
         - Architecture evolution
         - Performance impacts
         - Security updates
         - Dependency changes
         - Technical debt movement
      5. Metrics dashboard:
         - Quantitative measurements
         - Productivity indicators
         - Quality scores
      6. Detailed activity breakdown:
         - Each commit/PR/issue with deep analysis
         - Specific file:line references
         - GitHub permalinks
         - Technical impact assessment
      
      Style: ${inputData.preferences.aiVerbosity}
      Focus areas: ${focusAreas.join(', ')}
      
      Make the report actionable, insightful, and celebration-worthy.
      Include specific GitHub URLs and code references throughout.`,
    }]);

    // Parse the response and structure it
    try {
      const parsed = JSON.parse(response.text || '{}');
      
      // Extract detailed activities with proper linking
      const details = [];
      
      for (const analysis of inputData.codeAnalysis) {
        const toolResult = analysis.analysis?.[0]?.result;
        if (toolResult) {
          if (analysis.type === 'commit' && toolResult.commit) {
            details.push({
              type: 'commit',
              title: toolResult.commit.message?.split('\n')[0] || 'Commit',
              description: toolResult.analysis?.improvements?.join(', ') || '',
              githubUrl: toolResult.commit.url,
              sha: toolResult.commit.sha,
              fileReferences: toolResult.files?.map((f: any) => ({
                path: f.filename,
                url: f.blobUrl,
                linesAdded: f.additions,
                linesRemoved: f.deletions,
                language: f.language,
              })),
              technicalAnalysis: {
                complexity: toolResult.files?.[0]?.complexity,
                impact: toolResult.analysis?.impactLevel,
                category: toolResult.analysis?.categories,
                patterns: toolResult.analysis?.patterns,
              },
            });
          } else if (analysis.type === 'pr' && toolResult.pullRequest) {
            details.push({
              type: 'pr',
              title: toolResult.pullRequest.title,
              description: toolResult.pullRequest.body,
              githubUrl: toolResult.pullRequest.url,
              number: toolResult.pullRequest.number,
              technicalAnalysis: {
                impact: toolResult.impact?.breakingChanges ? 'high' : 'medium',
                category: ['pull-request'],
              },
            });
          }
        }
      }

      return {
        report: {
          summary: parsed.summary || 'Daily development activity analyzed.',
          technicalSummary: parsed.technicalSummary || parsed.summary || '',
          bullets: parsed.bullets || [],
          insights: parsed.insights || {},
          metrics: parsed.metrics || {},
          details,
        },
      };
    } catch (error) {
      console.error('Error parsing report:', error);
      return {
        report: {
          summary: response.text || 'Activity report generated.',
          technicalSummary: '',
          bullets: [],
          insights: {},
          metrics: {},
          details: [],
        },
      };
    }
  },
});

// Step 7: Store enhanced results
const storeResultsStep = createStep({
  id: 'store-results',
  description: 'Store the comprehensive analysis in the database',
  inputSchema: z.object({
    report: z.object({
      summary: z.string(),
      technicalSummary: z.string(),
      bullets: z.array(z.string()),
      insights: z.any(),
      metrics: z.any(),
      details: z.array(z.any()),
    }),
  }),
  outputSchema: z.object({
    logId: z.string(),
    success: z.boolean(),
  }),
  execute: async ({ inputData, getInitData, getStepResult }) => {
    try {
      const initData = getInitData();
      const { username, date } = initData;
      
      // Get repositories from configuration step
      const configResult = getStepResult(loadConfigurationStep);
      const repositories = configResult?.repositories || [];
      
      const logDate = new Date(date);
      logDate.setHours(12, 0, 0, 0);

      // Check for existing log
      const existingLog = await db
        .select()
        .from(activityLogsExtended)
        .where(eq(activityLogsExtended.date, logDate))
        .limit(1);

      let logId: string;

      const logData = {
        date: logDate,
        repositoryIds: repositories.map(r => r.id),
        summary: inputData.report.summary,
        technicalSummary: inputData.report.technicalSummary,
        bullets: inputData.report.bullets,
        insights: inputData.report.insights,
        metrics: inputData.report.metrics,
        rawData: inputData.report,
        appliedRules: [], // Would be populated from actual rule application
        processed: true,
        processingTime: Date.now(), // Would calculate actual time
      };

      if (existingLog.length > 0) {
        logId = existingLog[0].id;
        await db
          .update(activityLogsExtended)
          .set({
            ...logData,
            updatedAt: new Date(),
          })
          .where(eq(activityLogsExtended.id, logId));
      } else {
        const [newLog] = await db
          .insert(activityLogsExtended)
          .values(logData)
          .returning();
        
        logId = newLog.id;
      }

      // Store detailed activities
      if (inputData.report.details?.length > 0) {
        const detailsToStore = inputData.report.details.map((detail: any) => ({
          logId,
          repositoryId: repositories[0]?.id || '', // Would match to actual repo based on detail context
          type: detail.type,
          title: detail.title,
          description: detail.description,
          githubUrl: detail.githubUrl || '',
          sha: detail.sha,
          number: detail.number,
          fileReferences: detail.fileReferences,
          technicalAnalysis: detail.technicalAnalysis,
          metadata: detail,
        }));

        await db.insert(activityDetailsExtended).values(detailsToStore);
      }

      return { logId, success: true };
    } catch (error) {
      console.error('Error storing results:', error);
      return { logId: '', success: false };
    }
  },
});

// Create the enhanced GitHub analysis workflow
export const enhancedGitHubWorkflow = createWorkflow({
  id: 'github-deep-analysis',
  description: 'Deep GitHub activity analysis with comprehensive technical insights',
  inputSchema: z.object({
    username: z.string(),
    date: z.string(),
  }),
  outputSchema: z.object({
    logId: z.string(),
    success: z.boolean(),
  }),
});

// Chain the steps
enhancedGitHubWorkflow
  .then(loadConfigurationStep)
  .then(gatherContextStep)
  .then(fetchActivityStep)
  .then(analyzeCodeStep)
  .then(trackDebtStep)
  .then(generateReportStep)
  .then(storeResultsStep);

enhancedGitHubWorkflow.commit();
