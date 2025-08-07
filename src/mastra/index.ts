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
import { githubAnalysisWorkflow } from './workflows/github-workflow';
import { enhancedGitHubWorkflow } from './workflows/github-analysis-workflow';

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
    githubAnalysis: githubAnalysisWorkflow,
    enhancedGitHubAnalysis: enhancedGitHubWorkflow,
  },
});

export { githubAnalysisWorkflow } from './workflows/github-workflow';
export { enhancedGitHubWorkflow } from './workflows/github-analysis-workflow';