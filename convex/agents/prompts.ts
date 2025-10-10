/**
 * AI Agent Prompts
 *
 * All prompts structured using Anthropic XML best practices:
 * - <context> - Background information
 * - <data> - Input data
 * - <instructions> - What to do
 * - <formatting> - Expected output format
 * - <examples> - Sample outputs (where helpful)
 */

interface BatchAnalysisParams {
  repository: string;
  date: string;
  batchIndex: number;
  totalBatches: number;
  commits: Array<{ sha: string; message: string }>;
  pullRequests: Array<{ number: number; title: string }>;
  issues: Array<{ number: number; title: string }>;
  owner: string;
  repo: string;
}

export function batchAnalysisPrompt(params: BatchAnalysisParams): string {
  const { repository, date, batchIndex, totalBatches, commits, pullRequests, issues, owner, repo } = params;

  return `<context>
You are analyzing Luke's development work to create a bespoke daily log entry. Luke is a software engineer working across multiple repositories, and you need to understand what he actually built by inspecting the real code changes.
</context>

<data>
<repository>${repository}</repository>
<date>${date}</date>
<batch_info>Batch ${batchIndex + 1} of ${totalBatches}</batch_info>

<commits>
${commits.map(c => `- ${c.sha.substring(0, 7)}: ${c.message}`).join('\n')}
</commits>

${pullRequests.length > 0 ? `<pull_requests>
${pullRequests.map((pr: any) => `- #${pr.number}: ${pr.title}`).join('\n')}
</pull_requests>` : ''}

${issues.length > 0 ? `<issues>
${issues.map((issue: any) => `- #${issue.number}: ${issue.title}`).join('\n')}
</issues>` : ''}
</data>

<instructions>
You MUST use fetchCommitDetailsTool to inspect the actual code changes for each commit. This is CRITICAL for creating bespoke analysis.

For each commit listed above:
1. Call fetchCommitDetailsTool with parameters: { owner: "${owner}", repo: "${repo}", sha: "COMMIT_SHA" }
2. Examine the actual files changed, lines added/removed, and code patterns
3. Identify technical decisions, architectural choices, and implementation details
4. Note any risks, quality concerns, or interesting patterns

After inspecting all commits, synthesize your findings into a bespoke 2-3 sentence narrative that:
- Describes what Luke actually built (be specific about file types, architectural changes, or technical decisions)
- Focuses on meaningful technical work, not generic statements
- References concrete details from the actual code changes you inspected
</instructions>

<formatting>
Return a flowing prose narrative (2-3 sentences). NO markdown formatting, NO bullet points, NO section headers. Just natural, informative sentences about the actual work completed.
</formatting>`;
}

interface PatternDetectionParams {
  date: string;
  repoAnalyses: Array<{
    repository: string;
    mainFocus: string;
    progress: string;
    technicalHighlights?: string[];
    concerns?: string[];
  }>;
}

export function patternDetectionPrompt(params: PatternDetectionParams): string {
  const { date, repoAnalyses } = params;

  return `<context>
You are analyzing patterns across multiple repositories to identify themes in Luke's development work for ${date}. This helps understand the broader technical direction and focus areas.
</context>

<data>
<repository_summaries>
${repoAnalyses.map(r => `<repository name="${r.repository}">
  <focus>${r.mainFocus}</focus>
  <progress>${r.progress}</progress>
  <highlights>${r.technicalHighlights?.join(', ') || 'none'}</highlights>
  <concerns>${r.concerns?.join(', ') || 'none'}</concerns>
</repository>`).join('\n')}
</repository_summaries>
</data>

<instructions>
Analyze the repository summaries above and identify cross-cutting patterns. Look for:
1. **Patterns**: Recurring approaches or techniques used across repos (0-5 patterns)
2. **Themes**: Technical focus areas like "API development", "testing", "infrastructure" (0-5 themes)
3. **Stack Trends**: Technology or framework trends observed (0-3 trends)
4. **Methodology Insights**: Process or workflow observations (0-3 insights)
5. **Balance Assessment**: Brief description of how work was distributed across repositories

Be specific and concrete. If there are no clear patterns, use empty arrays rather than generic statements.
</instructions>

<formatting>
Return ONLY valid JSON matching this structure. No markdown code blocks, no explanatory text before or after.

{
  "patterns": ["specific pattern 1", "specific pattern 2"],
  "themes": ["theme 1"],
  "stackTrends": ["trend 1"],
  "methodologyInsights": ["insight 1"],
  "balanceAssessment": "brief distribution description"
}
</formatting>`;
}

interface RepoSummaryParams {
  repository: string;
  date: string;
  commitCount: number;
  batchAnalyses: string[];
}

export function repoSummaryPrompt(params: RepoSummaryParams): string {
  const { repository, date, commitCount, batchAnalyses } = params;

  return `<context>
The analysis is complete. You have already inspected all commits, pull requests, and issues through detailed batch analyses. Your task now is to synthesize these narratives into a structured JSON summary.
</context>

<data>
<repository>${repository}</repository>
<date>${date}</date>
<commit_count>${commitCount}</commit_count>

<completed_analyses>
${batchAnalyses.join('\n\n---\n\n')}
</completed_analyses>
</data>

<instructions>
IMPORTANT: DO NOT call any tools or fetch additional data. The analysis is already complete.

Synthesize the batch analyses above into a JSON object with these fields:
- **repository**: "${repository}"
- **commitCount**: ${commitCount}
- **mainFocus**: Brief description of main work focus (1 sentence)
- **progress**: What was accomplished (1 sentence)
- **technicalHighlights**: Array of 2-5 key technical achievements
- **concerns**: Array of 0-3 potential issues or risks identified
- **nextSteps**: Array of 0-3 suggested next actions

Extract real details from the narratives. Be specific and concrete based on what was actually analyzed.
</instructions>

<formatting>
CRITICAL: Return ONLY valid JSON. No markdown code blocks, no preamble, no explanations. Just the raw JSON object.

Example structure:
{
  "repository": "${repository}",
  "commitCount": ${commitCount},
  "mainFocus": "specific focus area from analysis",
  "progress": "concrete accomplishment",
  "technicalHighlights": ["highlight 1", "highlight 2"],
  "concerns": ["concern 1"],
  "nextSteps": ["next step 1"]
}
</formatting>`;
}

interface GlobalSynthesisParams {
  date: string;
  repoAnalyses: Array<{
    repository: string;
    commitCount: number;
    mainFocus: string;
    progress: string;
    technicalHighlights?: string[];
    stats?: {
      totalAdditions: number;
      totalDeletions: number;
      filesChanged: number;
    };
  }>;
  patterns: {
    patterns?: string[];
    themes?: string[];
  };
  stats: {
    totalCommits: number;
    repositories: string[];
  };
}

export function globalSynthesisPrompt(params: GlobalSynthesisParams): string {
  const { date, repoAnalyses, patterns, stats } = params;

  return `<context>
You are creating Luke's daily development log for ${date}. All repository analyses and pattern detection are complete. Your task is to synthesize this information into a rich, structured daily log entry.

The log should have a concise narrative (1-3 short paragraphs) but be rich in structured metadata for analysis and reflection.
</context>

<data>
<statistics>
  <total_commits>${stats.totalCommits}</total_commits>
  <repositories>${stats.repositories.join(', ')}</repositories>
</statistics>

<repository_summaries>
${repoAnalyses.map(r => `<repository name="${r.repository}">
  <commits>${r.commitCount}</commits>
  <focus>${r.mainFocus}</focus>
  <progress>${r.progress}</progress>
  <highlights>${Array.isArray(r.technicalHighlights) && r.technicalHighlights.length ? r.technicalHighlights.join(', ') : 'none'}</highlights>
  ${r.stats ? `<stats>+${r.stats.totalAdditions}/-${r.stats.totalDeletions}, files: ${r.stats.filesChanged}</stats>` : ''}
</repository>`).join('\n')}
</repository_summaries>

<cross_repository_patterns>
  <patterns>${patterns.patterns?.join(', ') || 'none'}</patterns>
  <themes>${patterns.themes?.join(', ') || 'none'}</themes>
</cross_repository_patterns>
</data>

<instructions>
IMPORTANT: DO NOT call any tools or fetch additional data. All analysis is complete.

Create a comprehensive daily log with these components:

1. **title**: Engaging title summarizing the day (be creative but informative)
2. **narrative**: Concise summary of the day's work (1-3 short paragraphs, flowing prose)
3. **highlights**: Crisp bullet points of key accomplishments (array of strings)
4. **repoSummaries**: Array of objects with { repository, commitCount, mainFocus, progress }
5. **crossRepoPatterns**: Array of cross-repository patterns identified
6. **technicalThemes**: Array of technical themes from patterns
7. **suggestions**: Actionable recommendations array. Use empty array [] if no good suggestions. If you include suggestions, EVERY suggestion MUST have complete fields: id (string), title (string), category (string), priority (string). NO incomplete objects allowed - better to return empty array than incomplete suggestions
8. **metrics**: Object with totalCommits, totalRepos, primaryLanguages (array), codeQualityTrend ("improving" | "stable" | "declining"), productivityScore (1-10)
9. **haiku**: Optional haiku capturing the essence of the day's work (string or undefined)

Make the narrative engaging and specific to the actual work done. Reference real technical details from the repository summaries.
</instructions>

<formatting>
Return ONLY valid JSON matching the GlobalAnalysis schema. No markdown code blocks, no preamble, no explanations. Just the raw JSON object.

CRITICAL RULE FOR SUGGESTIONS: If you generate ANY suggestion objects, each one MUST have ALL four required fields: id, title, category, priority. If you cannot provide complete suggestions with all fields, use an empty array instead: "suggestions": []
</formatting>`;
}
