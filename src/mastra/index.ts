import { Mastra } from '@mastra/core';
import { 
  commitAnalyzerAgent, 
  activitySummarizerAgent, 
  repoAnalyzerAgent 
} from './agents/github-agents';
import {
  codeAnalysisAgent,
  repoContextAgent,
  activitySynthesisAgent,
  prReviewAgent,
  technicalDebtAgent,
} from './agents/code-analysis-agents';
import generateDailyLog from './workflows/generate-daily-log';

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
});

export { default as generateDailyLog } from './workflows/generate-daily-log';