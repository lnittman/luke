import { Mastra } from '@mastra/core'
import {
  activitySynthesisAgent,
  codeAnalysisAgent,
  prReviewAgent,
  repoContextAgent,
  technicalDebtAgent,
} from './agents/code-analysis-agents'
import {
  activitySummarizerAgent,
  commitAnalyzerAgent,
  repoAnalyzerAgent,
} from './agents/github-agents'
import generateDailyLog from './workflows/generate-daily-log'

export const mastra = new Mastra({
  agents: {
    // Basic agents
    commitAnalyzer: commitAnalyzerAgent,
    activitySummarizer: activitySummarizerAgent,
    repoAnalyzer: repoAnalyzerAgent,
    // Enhanced agents
    codeAnalysis: codeAnalysisAgent,
    repoContext: repoContextAgent,
    activitySynthesis: activitySynthesisAgent,
    prReview: prReviewAgent,
    technicalDebt: technicalDebtAgent,
  },
  workflows: {
    generateDailyLog,
  },
})

export { default as generateDailyLog } from './workflows/generate-daily-log'
