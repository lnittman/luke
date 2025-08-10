import { createStep } from '@mastra/core/workflows'
import { and, eq, gte, isNull, lt } from 'drizzle-orm'
import { z } from 'zod'
import { activityLogs, db, userPreferences } from '@/lib/db'

export const checkExistingLogStep = createStep({
  id: 'check-existing-log',
  description: 'Check if daily log already exists and get GitHub token',
  inputSchema: z.object({
    date: z.date().default(() => new Date()),
    forceRegenerate: z.boolean().default(false),
  }),
  outputSchema: z.object({
    shouldContinue: z.boolean(),
    logId: z.string().optional(),
    githubToken: z.string().optional(),
    date: z.date(),
  }),
  execute: async ({ inputData }) => {
    const { date, forceRegenerate } = inputData

    // Check if log already exists
    if (!forceRegenerate) {
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const existingLog = await db
        .select()
        .from(activityLogs)
        .where(
          and(
            eq(activityLogs.logType, 'global'),
            isNull(activityLogs.repositoryId),
            gte(activityLogs.date, startOfDay),
            lt(activityLogs.date, endOfDay)
          )
        )
        .limit(1)

      if (existingLog.length > 0) {
        console.log('Daily analysis already exists for', date)
        return { 
          shouldContinue: false,
          logId: existingLog[0].id,
          date
        }
      }
    }

    // Get user preferences and GitHub token
    const [userPref] = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, 'default'))
      .limit(1)

    if (!userPref?.globalLogsEnabled) {
      console.log('Global logs disabled')
      return { 
        shouldContinue: false,
        date
      }
    }

    const githubToken = (userPref.metadata as any)?.githubToken
    if (!githubToken) {
      console.error('GitHub token not configured')
      return { 
        shouldContinue: false,
        date
      }
    }

    return { 
      shouldContinue: true,
      githubToken,
      date
    }
  },
})