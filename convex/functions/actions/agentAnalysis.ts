import { action } from "../../_generated/server";
import { v } from "convex/values";
import { 
  makeRepoAnalyzerAgent, 
  makeActivitySummarizerAgent,
  makeCommitAnalyzerAgent 
} from "../../agents/githubAgents";
import { createGlobalAnalysisAgent } from "../../agents/globalAnalysis";
import { GLOBAL_ANALYSIS_XML } from "../../components/agents/instructions";
import { internal } from "../../_generated/api";
import { globalAnalysisSchema } from "../../lib/analysisSchema";
import { z } from "zod";

// Analyze a single repository with its commits
export const analyzeRepository = action({
  args: {
    repository: v.string(),
    commitBatches: v.array(v.array(v.object({
      sha: v.string(),
      message: v.string(),
      repository: v.string(),
      timestamp: v.string(),
      author: v.string(),
      url: v.string()
    }))),
    date: v.string(),
    pullRequests: v.array(v.any()),
    issues: v.array(v.any())
  },
  handler: async (ctx, { repository, commitBatches, date, pullRequests, issues }) => {
    console.log(`[RepoAnalyzer] Analyzing ${repository} with ${commitBatches.flat().length} commits`);
    
    // Create a repository analyzer agent
    const agent = await makeRepoAnalyzerAgent(ctx);
    
    // Create a thread for this repository analysis
    const { thread } = await agent.createThread(ctx as any, {});
    
    // Analyze commits in batches to avoid overwhelming the agent
    const batchAnalyses = [];
    for (const [index, batch] of commitBatches.entries()) {
      const prompt = `
Analyze this batch of commits (${index + 1}/${commitBatches.length}) for repository ${repository}:

Commits:
${batch.map(c => `- ${c.sha.substring(0, 7)}: ${c.message}`).join('\n')}

${pullRequests.length > 0 ? `Pull Requests:\n${pullRequests.map((pr: any) => `- #${pr.number}: ${pr.title} (${pr.state})`).join('\n')}` : ''}

${issues.length > 0 ? `Issues:\n${issues.map((issue: any) => `- #${issue.number}: ${issue.title} (${issue.state})`).join('\n')}` : ''}

Provide:
1. Main changes and patterns in this batch
2. Technical improvements or concerns
3. Progress indicators
`;
      
      const result = await thread.generateText({ 
        prompt
      });
      
      batchAnalyses.push(result.text);
    }
    
    // Generate final repository summary
    const summaryPrompt = `
Based on the analysis of ${commitBatches.flat().length} commits in ${repository} on ${date}, create a comprehensive repository summary.

Batch analyses:
${batchAnalyses.join('\n---\n')}

Generate a JSON summary with:
{
  "repository": "${repository}",
  "commitCount": ${commitBatches.flat().length},
  "mainFocus": "primary area of work",
  "progress": "what was accomplished",
  "technicalHighlights": ["key technical achievements"],
  "concerns": ["any issues or tech debt"],
  "nextSteps": ["suggested follow-ups"]
}
`;
    
    const RepoSummarySchema = z.object({
      repository: z.string(),
      commitCount: z.number(),
      mainFocus: z.string(),
      progress: z.string(),
      technicalHighlights: z.array(z.string()).optional().default([]),
      concerns: z.array(z.string()).optional().default([]),
      nextSteps: z.array(z.string()).optional().default([])
    });
    const summary = await thread.generateObject({
      prompt: summaryPrompt,
      schema: RepoSummarySchema
    });
    
    return {
      ...summary.object,
      threadId: thread.threadId,
      messageCount: batchAnalyses.length + 2 // batches + summary
    };
  }
});

// Detect patterns across repositories
export const detectCrossRepoPatterns = action({
  args: {
    repoAnalyses: v.array(v.any()),
    date: v.string()
  },
  handler: async (ctx, { repoAnalyses, date }) => {
    console.log(`[PatternDetector] Analyzing patterns across ${repoAnalyses.length} repositories`);
    
    // Create activity summarizer agent for pattern detection
    const agent = await makeActivitySummarizerAgent(ctx);
    
    // Create a thread for pattern detection
    const { thread } = await agent.createThread(ctx as any, {});
    
    const prompt = `
Analyze activity patterns across ${repoAnalyses.length} repositories on ${date}.

Repository summaries:
${repoAnalyses.map(r => `
${r.repository}:
- Focus: ${r.mainFocus}
- Progress: ${r.progress}
- Highlights: ${r.technicalHighlights?.join(', ') || 'none'}
- Concerns: ${r.concerns?.join(', ') || 'none'}
`).join('\n')}

Identify:
1. Cross-repository patterns and themes
2. Technology stack trends
3. Development methodology patterns
4. Areas of focus vs areas neglected
5. Overall productivity indicators

Return JSON:
{
  "patterns": ["pattern descriptions"],
  "themes": ["technical themes"],
  "stackTrends": ["technology trends"],
  "methodologyInsights": ["process observations"],
  "balanceAssessment": "how work is distributed"
}
`;
    
    const PatternSchema = z.object({
      patterns: z.array(z.string()),
      themes: z.array(z.string()),
      stackTrends: z.array(z.string()).optional().default([]),
      methodologyInsights: z.array(z.string()).optional().default([]),
      balanceAssessment: z.string().optional().default("")
    });
    const result = await thread.generateObject({
      prompt,
      schema: PatternSchema
    });
    
    return {
      ...result.object,
      threadId: thread.threadId
    };
  }
});

// Generate final global synthesis
export const generateGlobalSynthesis = action({
  args: {
    date: v.string(),
    repoAnalyses: v.array(v.any()),
    patterns: v.any(),
    stats: v.object({
      totalCommits: v.number(),
      totalRepos: v.number(),
      repositories: v.array(v.string())
    })
  },
  handler: async (ctx, { date, repoAnalyses, patterns, stats }) => {
    console.log(`[GlobalSynthesis] Creating final synthesis for ${date}`);
    
    // Load instructions from settings or use default
    const i = internal as any;
    const instructions = await ctx.runQuery(i.functions.queries.settings.getByKey, {
      key: "agents/globalAnalysis",
    }) || GLOBAL_ANALYSIS_XML;
    
    // Create global analysis agent
    const agent = createGlobalAnalysisAgent(instructions as string, process.env.OPENROUTER_API_KEY);
    
    // Create thread for global synthesis
    const { thread } = await agent.createThread(ctx as any, {});
    
    const prompt = `
Create a comprehensive daily development log for ${date}.

Statistics:
- Total commits: ${stats.totalCommits}
- Repositories: ${stats.repositories.join(', ')}

Repository Work:
${repoAnalyses.map(r => `
${r.repository} (${r.commitCount} commits):
- Focus: ${r.mainFocus}
- Progress: ${r.progress}
- Highlights: ${r.technicalHighlights?.join(', ') || 'none'}
`).join('\n')}

Cross-Repository Patterns:
- Patterns: ${patterns.patterns?.join(', ') || 'none identified'}
- Themes: ${patterns.themes?.join(', ') || 'none identified'}
- Balance: ${patterns.balanceAssessment || 'not assessed'}

Generate a comprehensive log with:
1. Engaging title capturing the day's essence
2. Narrative summary (2-3 paragraphs)
3. Key highlights and achievements
4. Technical themes and patterns
5. Actionable suggestions for tomorrow
6. Metrics and productivity assessment
7. Optional: A haiku capturing the day's coding spirit

Return as structured JSON matching the log schema.
`;
    
    const result = await thread.generateObject({
      prompt,
      schema: globalAnalysisSchema as any
    });
    
    return {
      ...result.object,
      threadId: thread.threadId
    };
  }
});
