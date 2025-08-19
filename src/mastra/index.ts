import { Mastra } from '@mastra/core'
import { PinoLogger } from '@mastra/loggers'
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
import { githubDailyAnalysisWorkflow } from './workflows/github-daily-analysis'

export const mastra = new Mastra({
  logger: new PinoLogger({
    name: 'logs',
    level: 'debug', // Set to debug for maximum verbosity
  }),
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
    'github-daily-analysis': githubDailyAnalysisWorkflow,
  },
})

export { githubDailyAnalysisWorkflow } from './workflows/github-daily-analysis'
