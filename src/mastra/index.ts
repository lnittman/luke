import { Mastra } from '@mastra/core';
import { 
  commitAnalyzerAgent, 
  activitySummarizerAgent, 
  repoAnalyzerAgent 
} from './agents/github-agents';
import { githubAnalysisWorkflow } from './workflows/github-workflow';

export const mastra = new Mastra({
  agents: {
    commitAnalyzer: commitAnalyzerAgent,
    activitySummarizer: activitySummarizerAgent,
    repoAnalyzer: repoAnalyzerAgent,
  },
  workflows: {
    githubAnalysis: githubAnalysisWorkflow,
  },
});

export { githubAnalysisWorkflow } from './workflows/github-workflow';