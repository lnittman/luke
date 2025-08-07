import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';
import { 
  commitAnalyzerAgent, 
  activitySummarizerAgent, 
  repoAnalyzerAgent 
} from '../agents/github-agents';
import { db, activityLogs, activityDetails } from '@/lib/db';
import { eq } from 'drizzle-orm';

// Step 1: Fetch GitHub activity
const fetchActivityStep = createStep({
  id: 'fetch-activity',
  description: 'Fetch GitHub activity for the day',
  inputSchema: z.object({
    username: z.string(),
    date: z.string(),
  }),
  outputSchema: z.object({
    rawActivity: z.any(),
  }),
  execute: async ({ inputData }) => {
    const response = await activitySummarizerAgent.generate([{
      role: 'user',
      content: `Fetch all GitHub activity for user ${inputData.username} on ${inputData.date}. 
      Use the fetch-user-activity tool to get the data.`,
    }], {
      toolChoice: 'required',
    });

    return { rawActivity: response };
  },
});

// Step 2: Analyze and summarize activity
const analyzeActivityStep = createStep({
  id: 'analyze-activity',
  description: 'Analyze and summarize the GitHub activity',
  inputSchema: z.object({
    rawActivity: z.any(),
  }),
  outputSchema: z.object({
    summary: z.string(),
    bullets: z.array(z.string()),
    metadata: z.any(),
  }),
  execute: async ({ inputData }) => {
    const response = await activitySummarizerAgent.generate([{
      role: 'user',
      content: `Analyze this GitHub activity data and create a daily summary:
        
        ${JSON.stringify(inputData.rawActivity, null, 2)}
        
        Create:
        1. A 2-3 sentence summary of the day's work
        2. 5-10 bullet points of key accomplishments
        3. Metadata about the activity (total commits, repos worked on, languages, etc.)
        
        Format your response as JSON with keys: summary, bullets, metadata`,
    }]);

    try {
      const parsed = JSON.parse(response.text || '{}');
      return {
        summary: parsed.summary || 'No activity summary generated',
        bullets: parsed.bullets || [],
        metadata: parsed.metadata || {},
      };
    } catch {
      return {
        summary: response.text || 'No activity summary generated',
        bullets: [],
        metadata: {},
      };
    }
  },
});

// Step 3: Store in database
const storeActivityStep = createStep({
  id: 'store-activity',
  description: 'Store the analyzed activity in the database',
  inputSchema: z.object({
    summary: z.string(),
    bullets: z.array(z.string()),
    metadata: z.any(),
  }),
  outputSchema: z.object({
    logId: z.string(),
    success: z.boolean(),
  }),
  execute: async ({ inputData, getInitData, getStepResult }) => {
    try {
      // Get initial workflow input for date
      const initData = getInitData();
      const logDate = new Date(initData.date);
      logDate.setHours(12, 0, 0, 0); // Normalize to noon to avoid timezone issues
      
      // Get raw activity from first step
      const fetchResult = getStepResult(fetchActivityStep);
      const rawActivity = fetchResult?.rawActivity;

      // Check if log already exists for this date
      const existingLog = await db
        .select()
        .from(activityLogs)
        .where(eq(activityLogs.date, logDate))
        .limit(1);

      let logId: string;

      if (existingLog.length > 0) {
        // Update existing log
        logId = existingLog[0].id;
        await db
          .update(activityLogs)
          .set({
            summary: inputData.summary,
            bullets: inputData.bullets,
            metadata: inputData.metadata,
            rawData: rawActivity,
            processed: true,
            updatedAt: new Date(),
          })
          .where(eq(activityLogs.id, logId));
      } else {
        // Create new log
        const [newLog] = await db
          .insert(activityLogs)
          .values({
            date: logDate,
            summary: inputData.summary,
            bullets: inputData.bullets,
            metadata: inputData.metadata,
            rawData: rawActivity,
            processed: true,
          })
          .returning();
        
        logId = newLog.id;
      }

      // Extract and store activity details
      const rawData = rawActivity?.toolCalls?.[0]?.result || {};
      const details = [];

      // Store commits
      if (rawData.commits?.length > 0) {
        for (const commit of rawData.commits) {
          details.push({
            logId,
            type: 'commit',
            title: commit.message?.split('\n')[0] || 'Commit',
            description: commit.message,
            url: commit.url,
            metadata: commit,
          });
        }
      }

      // Store PRs
      if (rawData.pullRequests?.length > 0) {
        for (const pr of rawData.pullRequests) {
          details.push({
            logId,
            type: 'pr',
            title: pr.title || 'Pull Request',
            description: pr.body,
            url: pr.html_url,
            metadata: pr,
          });
        }
      }

      // Store issues
      if (rawData.issues?.length > 0) {
        for (const issue of rawData.issues) {
          details.push({
            logId,
            type: 'issue',
            title: issue.title || 'Issue',
            description: issue.body,
            url: issue.html_url,
            metadata: issue,
          });
        }
      }

      if (details.length > 0) {
        await db.insert(activityDetails).values(details);
      }

      return { logId, success: true };
    } catch (error) {
      console.error('Error storing activity:', error);
      return { logId: '', success: false };
    }
  },
});

// Create the workflow
export const githubAnalysisWorkflow = createWorkflow({
  id: 'github-analysis',
  description: 'Analyze GitHub activity and create daily logs',
  inputSchema: z.object({
    username: z.string(),
    date: z.string(), // YYYY-MM-DD format
  }),
  outputSchema: z.object({
    logId: z.string(),
    success: z.boolean(),
  }),
});

// Chain the steps
githubAnalysisWorkflow
  .then(fetchActivityStep)
  .then(analyzeActivityStep)
  .then(storeActivityStep);

githubAnalysisWorkflow.commit();