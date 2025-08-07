import { createTool } from '@mastra/core/tools';
import { z } from 'zod';
import { Octokit } from '@octokit/rest';

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

// Deep commit analysis tool
export const analyzeCommitDiffTool = createTool({
  id: 'analyze-commit-diff',
  description: 'Analyze commit diffs with code context and impact assessment',
  inputSchema: z.object({
    owner: z.string(),
    repo: z.string(),
    sha: z.string(),
  }),
  outputSchema: z.object({
    commit: z.object({
      sha: z.string(),
      message: z.string(),
      url: z.string(),
      author: z.string(),
      timestamp: z.string(),
    }),
    stats: z.object({
      additions: z.number(),
      deletions: z.number(),
      filesChanged: z.number(),
    }),
    files: z.array(z.object({
      filename: z.string(),
      status: z.string(),
      additions: z.number(),
      deletions: z.number(),
      changes: z.number(),
      patch: z.string().optional(),
      blobUrl: z.string(),
      language: z.string().optional(),
      complexity: z.object({
        cyclomatic: z.number().optional(),
        cognitive: z.number().optional(),
      }).optional(),
    })),
    analysis: z.object({
      impactLevel: z.enum(['trivial', 'low', 'medium', 'high', 'critical']),
      categories: z.array(z.string()),
      patterns: z.array(z.string()),
      risks: z.array(z.string()),
      improvements: z.array(z.string()),
    }),
  }),
  execute: async ({ context }) => {
    const { owner, repo, sha } = context;
    
    try {
      // Get detailed commit information with diff
      const { data: commit } = await octokit.repos.getCommit({
        owner,
        repo,
        ref: sha,
      });

      // Analyze each file
      const analyzedFiles = commit.files?.map(file => {
        const language = getLanguageFromFilename(file.filename);
        const complexity = analyzeCodeComplexity(file.patch || '');
        
        return {
          filename: file.filename,
          status: file.status,
          additions: file.additions,
          deletions: file.deletions,
          changes: file.changes,
          patch: file.patch,
          blobUrl: file.blob_url,
          language,
          complexity,
        };
      }) || [];

      // Perform impact analysis
      const analysis = performImpactAnalysis(commit, analyzedFiles);

      return {
        commit: {
          sha: commit.sha,
          message: commit.commit.message,
          url: commit.html_url,
          author: commit.commit.author?.name || 'Unknown',
          timestamp: commit.commit.author?.date || new Date().toISOString(),
        },
        stats: {
          additions: commit.stats?.additions || 0,
          deletions: commit.stats?.deletions || 0,
          filesChanged: commit.files?.length || 0,
        },
        files: analyzedFiles,
        analysis,
      };
    } catch (error) {
      console.error('Error analyzing commit:', error);
      throw error;
    }
  },
});

// Repository context analysis tool
export const analyzeRepositoryContextTool = createTool({
  id: 'analyze-repository-context',
  description: 'Get deep context about a repository including structure, patterns, and quality metrics',
  inputSchema: z.object({
    owner: z.string(),
    repo: z.string(),
    branch: z.string().optional(),
  }),
  outputSchema: z.object({
    repository: z.object({
      name: z.string(),
      fullName: z.string(),
      description: z.string().nullable(),
      url: z.string(),
      defaultBranch: z.string(),
      language: z.string().nullable(),
      topics: z.array(z.string()),
      stars: z.number(),
      forks: z.number(),
      openIssues: z.number(),
    }),
    structure: z.object({
      hasTests: z.boolean(),
      hasCi: z.boolean(),
      hasDocumentation: z.boolean(),
      packageManager: z.string().nullable(),
      frameworks: z.array(z.string()),
      buildTools: z.array(z.string()),
    }),
    codeQuality: z.object({
      hasLinting: z.boolean(),
      hasTypeChecking: z.boolean(),
      testCoverage: z.number().optional(),
      codeSmells: z.array(z.string()),
    }),
    recentActivity: z.object({
      lastCommit: z.string(),
      activeContributors: z.number(),
      avgCommitsPerWeek: z.number(),
      releaseFrequency: z.string(),
    }),
  }),
  execute: async ({ context }) => {
    const { owner, repo, branch } = context;
    
    try {
      // Get repository information
      const { data: repository } = await octokit.repos.get({ owner, repo });
      
      // Get repository contents to analyze structure
      const { data: contents } = await octokit.repos.getContent({
        owner,
        repo,
        path: '',
        ref: branch || repository.default_branch,
      });

      // Analyze repository structure
      const structure = await analyzeRepoStructure(owner, repo, contents as any[]);
      
      // Get recent activity metrics
      const recentActivity = await getRecentActivity(owner, repo);
      
      // Analyze code quality indicators
      const codeQuality = await analyzeCodeQuality(owner, repo, structure);

      return {
        repository: {
          name: repository.name,
          fullName: repository.full_name,
          description: repository.description,
          url: repository.html_url,
          defaultBranch: repository.default_branch,
          language: repository.language,
          topics: repository.topics || [],
          stars: repository.stargazers_count,
          forks: repository.forks_count,
          openIssues: repository.open_issues_count,
        },
        structure,
        codeQuality,
        recentActivity,
      };
    } catch (error) {
      console.error('Error analyzing repository context:', error);
      throw error;
    }
  },
});

// Pull request deep analysis tool
export const analyzePullRequestTool = createTool({
  id: 'analyze-pull-request',
  description: 'Deeply analyze a pull request including code changes, review feedback, and impact',
  inputSchema: z.object({
    owner: z.string(),
    repo: z.string(),
    pullNumber: z.number(),
  }),
  outputSchema: z.object({
    pullRequest: z.object({
      number: z.number(),
      title: z.string(),
      url: z.string(),
      state: z.string(),
      author: z.string(),
      createdAt: z.string(),
      mergedAt: z.string().nullable(),
      body: z.string().nullable(),
    }),
    changes: z.object({
      commits: z.number(),
      additions: z.number(),
      deletions: z.number(),
      changedFiles: z.number(),
      filesDetails: z.array(z.object({
        filename: z.string(),
        status: z.string(),
        additions: z.number(),
        deletions: z.number(),
        patch: z.string().optional(),
      })),
    }),
    review: z.object({
      reviews: z.number(),
      approvals: z.number(),
      changesRequested: z.number(),
      comments: z.number(),
      conversations: z.array(z.object({
        path: z.string().optional(),
        line: z.number().optional(),
        body: z.string(),
        author: z.string(),
      })),
    }),
    impact: z.object({
      breakingChanges: z.boolean(),
      testsCoverage: z.boolean(),
      documentationUpdated: z.boolean(),
      performanceImpact: z.enum(['improvement', 'neutral', 'regression']),
      securityImpact: z.enum(['improvement', 'neutral', 'risk']),
    }),
  }),
  execute: async ({ context }) => {
    const { owner, repo, pullNumber } = context;
    
    try {
      // Get PR details
      const { data: pr } = await octokit.pulls.get({
        owner,
        repo,
        pull_number: pullNumber,
      });

      // Get PR files
      const { data: files } = await octokit.pulls.listFiles({
        owner,
        repo,
        pull_number: pullNumber,
        per_page: 100,
      });

      // Get PR reviews
      const { data: reviews } = await octokit.pulls.listReviews({
        owner,
        repo,
        pull_number: pullNumber,
      });

      // Get PR comments
      const { data: comments } = await octokit.pulls.listReviewComments({
        owner,
        repo,
        pull_number: pullNumber,
        per_page: 100,
      });

      // Analyze impact
      const impact = analyzePRImpact(pr, files, reviews);

      return {
        pullRequest: {
          number: pr.number,
          title: pr.title,
          url: pr.html_url,
          state: pr.state,
          author: pr.user?.login || 'Unknown',
          createdAt: pr.created_at,
          mergedAt: pr.merged_at,
          body: pr.body,
        },
        changes: {
          commits: pr.commits,
          additions: pr.additions,
          deletions: pr.deletions,
          changedFiles: pr.changed_files,
          filesDetails: files.map(f => ({
            filename: f.filename,
            status: f.status,
            additions: f.additions,
            deletions: f.deletions,
            patch: f.patch,
          })),
        },
        review: {
          reviews: reviews.length,
          approvals: reviews.filter(r => r.state === 'APPROVED').length,
          changesRequested: reviews.filter(r => r.state === 'CHANGES_REQUESTED').length,
          comments: comments.length,
          conversations: comments.slice(0, 10).map(c => ({
            path: c.path,
            line: c.line || c.original_line,
            body: c.body,
            author: c.user?.login || 'Unknown',
          })),
        },
        impact,
      };
    } catch (error) {
      console.error('Error analyzing pull request:', error);
      throw error;
    }
  },
});

// Code pattern detection tool
export const detectCodePatternsTool = createTool({
  id: 'detect-code-patterns',
  description: 'Detect design patterns, anti-patterns, and architectural decisions in code changes',
  inputSchema: z.object({
    files: z.array(z.object({
      filename: z.string(),
      patch: z.string(),
      language: z.string().optional(),
    })),
  }),
  outputSchema: z.object({
    patterns: z.array(z.object({
      type: z.enum(['design-pattern', 'anti-pattern', 'architectural']),
      name: z.string(),
      description: z.string(),
      files: z.array(z.string()),
      confidence: z.number(),
    })),
    suggestions: z.array(z.string()),
    technicalDebt: z.object({
      score: z.number(),
      items: z.array(z.string()),
    }),
  }),
  execute: async ({ context }) => {
    const { files } = context;
    
    const patterns: any[] = [];
    const suggestions: string[] = [];
    const debtItems: string[] = [];
    
    for (const file of files) {
      if (!file.patch) continue;
      
      // Detect common patterns
      const detected = detectPatterns(file.filename, file.patch, file.language);
      patterns.push(...detected.patterns);
      suggestions.push(...detected.suggestions);
      debtItems.push(...detected.debtItems);
    }

    return {
      patterns: deduplicatePatterns(patterns),
      suggestions: Array.from(new Set(suggestions)),
      technicalDebt: {
        score: calculateDebtScore(debtItems),
        items: Array.from(new Set(debtItems)),
      },
    };
  },
});

// Helper functions
function getLanguageFromFilename(filename: string): string {
  const ext = filename.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    ts: 'TypeScript',
    tsx: 'TypeScript',
    js: 'JavaScript',
    jsx: 'JavaScript',
    py: 'Python',
    java: 'Java',
    cpp: 'C++',
    c: 'C',
    go: 'Go',
    rs: 'Rust',
    swift: 'Swift',
    kt: 'Kotlin',
    rb: 'Ruby',
    php: 'PHP',
    cs: 'C#',
  };
  return langMap[ext || ''] || 'Unknown';
}

function analyzeCodeComplexity(patch: string): { cyclomatic?: number; cognitive?: number } {
  if (!patch) return {};
  
  // Simple complexity heuristics based on patch
  const lines = patch.split('\n');
  let cyclomatic = 1;
  let cognitive = 0;
  
  for (const line of lines) {
    if (line.startsWith('+')) {
      // Count control flow statements
      if (/\b(if|else|for|while|switch|case|catch)\b/.test(line)) cyclomatic++;
      if (/\b(&&|\|\||\?:?)\b/.test(line)) cyclomatic++;
      
      // Cognitive complexity (nesting, etc.)
      const indentLevel = (line.match(/^\+\s*/)?.[0].length || 0) - 1;
      cognitive += Math.floor(indentLevel / 2);
    }
  }
  
  return { cyclomatic, cognitive };
}

function performImpactAnalysis(commit: any, files: any[]): any {
  const totalChanges = (commit.stats?.additions || 0) + (commit.stats?.deletions || 0);
  const categories: string[] = [];
  const patterns: string[] = [];
  const risks: string[] = [];
  const improvements: string[] = [];
  
  // Categorize based on commit message and files
  const message = commit.commit.message.toLowerCase();
  if (message.includes('fix') || message.includes('bug')) categories.push('bugfix');
  if (message.includes('feat') || message.includes('add')) categories.push('feature');
  if (message.includes('refactor')) categories.push('refactoring');
  if (message.includes('perf')) categories.push('performance');
  if (message.includes('security') || message.includes('vulnerability')) categories.push('security');
  if (message.includes('test')) categories.push('testing');
  if (message.includes('docs')) categories.push('documentation');
  
  // Analyze files for patterns
  for (const file of files) {
    if (file.filename.includes('test')) patterns.push('test-coverage');
    if (file.filename.includes('config')) patterns.push('configuration-change');
    if (file.filename.includes('package.json')) patterns.push('dependency-change');
    if (file.patch?.includes('TODO') || file.patch?.includes('FIXME')) risks.push('unfinished-work');
    if (file.patch?.includes('console.log')) risks.push('debug-code');
    if (file.deletions > file.additions * 2) improvements.push('code-cleanup');
  }
  
  // Determine impact level
  let impactLevel: 'trivial' | 'low' | 'medium' | 'high' | 'critical' = 'low';
  if (totalChanges < 10) impactLevel = 'trivial';
  else if (totalChanges < 50) impactLevel = 'low';
  else if (totalChanges < 200) impactLevel = 'medium';
  else if (totalChanges < 500) impactLevel = 'high';
  else impactLevel = 'critical';
  
  if (categories.includes('security')) impactLevel = 'critical';
  if (patterns.includes('dependency-change')) {
    impactLevel = impactLevel === 'trivial' ? 'low' : impactLevel;
  }
  
  return {
    impactLevel,
    categories: Array.from(new Set(categories)),
    patterns: Array.from(new Set(patterns)),
    risks: Array.from(new Set(risks)),
    improvements: Array.from(new Set(improvements)),
  };
}

async function analyzeRepoStructure(owner: string, repo: string, contents: any[]): Promise<any> {
  const fileNames = contents.map(item => item.name.toLowerCase());
  
  return {
    hasTests: fileNames.some(name => 
      name.includes('test') || name.includes('spec') || 
      name === '__tests__' || name === 'tests'
    ),
    hasCi: fileNames.some(name => 
      name === '.github' || name === '.circleci' || 
      name === '.travis.yml' || name === 'jenkinsfile'
    ),
    hasDocumentation: fileNames.some(name => 
      name === 'readme.md' || name === 'docs' || 
      name === 'documentation'
    ),
    packageManager: detectPackageManager(fileNames),
    frameworks: detectFrameworks(fileNames),
    buildTools: detectBuildTools(fileNames),
  };
}

function detectPackageManager(files: string[]): string | null {
  if (files.includes('package.json')) return 'npm/yarn/pnpm';
  if (files.includes('pipfile') || files.includes('requirements.txt')) return 'pip';
  if (files.includes('gemfile')) return 'bundler';
  if (files.includes('cargo.toml')) return 'cargo';
  if (files.includes('go.mod')) return 'go modules';
  return null;
}

function detectFrameworks(files: string[]): string[] {
  const frameworks: string[] = [];
  if (files.includes('next.config.js') || files.includes('next.config.mjs')) frameworks.push('Next.js');
  if (files.includes('gatsby-config.js')) frameworks.push('Gatsby');
  if (files.includes('vue.config.js')) frameworks.push('Vue');
  if (files.includes('angular.json')) frameworks.push('Angular');
  if (files.includes('django')) frameworks.push('Django');
  if (files.includes('rails')) frameworks.push('Rails');
  return frameworks;
}

function detectBuildTools(files: string[]): string[] {
  const tools: string[] = [];
  if (files.includes('webpack.config.js')) tools.push('Webpack');
  if (files.includes('vite.config.js')) tools.push('Vite');
  if (files.includes('rollup.config.js')) tools.push('Rollup');
  if (files.includes('gulpfile.js')) tools.push('Gulp');
  if (files.includes('makefile')) tools.push('Make');
  return tools;
}

async function getRecentActivity(owner: string, repo: string): Promise<any> {
  try {
    const { data: commits } = await octokit.repos.listCommits({
      owner,
      repo,
      per_page: 100,
    });
    
    const { data: contributors } = await octokit.repos.listContributors({
      owner,
      repo,
      per_page: 30,
    });
    
    const { data: releases } = await octokit.repos.listReleases({
      owner,
      repo,
      per_page: 10,
    });
    
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentCommits = commits.filter(c => 
      new Date(c.commit.author?.date || '') > oneWeekAgo
    );
    
    return {
      lastCommit: commits[0]?.commit.author?.date || 'Unknown',
      activeContributors: contributors.length,
      avgCommitsPerWeek: recentCommits.length,
      releaseFrequency: calculateReleaseFrequency(releases),
    };
  } catch {
    return {
      lastCommit: 'Unknown',
      activeContributors: 0,
      avgCommitsPerWeek: 0,
      releaseFrequency: 'Unknown',
    };
  }
}

function calculateReleaseFrequency(releases: any[]): string {
  if (releases.length < 2) return 'Irregular';
  
  const dates = releases.map(r => new Date(r.created_at).getTime());
  const intervals = [];
  
  for (let i = 1; i < dates.length; i++) {
    intervals.push(dates[i - 1] - dates[i]);
  }
  
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const days = avgInterval / (1000 * 60 * 60 * 24);
  
  if (days < 7) return 'Weekly';
  if (days < 14) return 'Bi-weekly';
  if (days < 30) return 'Monthly';
  if (days < 90) return 'Quarterly';
  return 'Irregular';
}

async function analyzeCodeQuality(owner: string, repo: string, structure: any): Promise<any> {
  const files = ['package.json', '.eslintrc', 'tsconfig.json', 'pyproject.toml'];
  const quality: any = {
    hasLinting: false,
    hasTypeChecking: false,
    testCoverage: 0,
    codeSmells: [],
  };
  
  try {
    // Check for common config files
    for (const file of files) {
      try {
        const { data } = await octokit.repos.getContent({
          owner,
          repo,
          path: file,
        });
        
        if (file.includes('eslint') || file.includes('prettier')) quality.hasLinting = true;
        if (file.includes('tsconfig')) quality.hasTypeChecking = true;
      } catch {
        // File doesn't exist
      }
    }
    
    // Basic code smell detection would go here
    // This would normally integrate with tools like SonarQube
    
    return quality;
  } catch {
    return quality;
  }
}

function analyzePRImpact(pr: any, files: any[], reviews: any[]): any {
  const hasTests = files.some(f => f.filename.includes('test') || f.filename.includes('spec'));
  const hasDocs = files.some(f => f.filename.includes('README') || f.filename.includes('docs'));
  const hasBreaking = pr.body?.includes('BREAKING') || pr.title.includes('!');
  
  let performanceImpact: 'improvement' | 'neutral' | 'regression' = 'neutral';
  let securityImpact: 'improvement' | 'neutral' | 'risk' = 'neutral';
  
  // Check for performance keywords
  const perfKeywords = ['optimize', 'performance', 'faster', 'speed', 'cache'];
  const regressionKeywords = ['slow', 'memory leak', 'bottleneck'];
  
  const allText = `${pr.title} ${pr.body}`.toLowerCase();
  
  if (perfKeywords.some(k => allText.includes(k))) performanceImpact = 'improvement';
  if (regressionKeywords.some(k => allText.includes(k))) performanceImpact = 'regression';
  
  // Check for security keywords
  const securityKeywords = ['security', 'vulnerability', 'CVE', 'patch'];
  const riskKeywords = ['bypass', 'expose', 'leak', 'injection'];
  
  if (securityKeywords.some(k => allText.includes(k))) securityImpact = 'improvement';
  if (riskKeywords.some(k => allText.includes(k))) securityImpact = 'risk';
  
  return {
    breakingChanges: hasBreaking,
    testsCoverage: hasTests,
    documentationUpdated: hasDocs,
    performanceImpact,
    securityImpact,
  };
}

function detectPatterns(filename: string, patch: string, language?: string): any {
  const patterns: any[] = [];
  const suggestions: string[] = [];
  const debtItems: string[] = [];
  
  const lines = patch.split('\n').filter(l => l.startsWith('+'));
  const codeBlock = lines.join('\n');
  
  // Design patterns
  if (/class\s+\w+\s+extends/.test(codeBlock)) {
    patterns.push({
      type: 'design-pattern',
      name: 'Inheritance',
      description: 'Class inheritance detected',
      files: [filename],
      confidence: 0.9,
    });
  }
  
  if (/interface\s+\w+/.test(codeBlock) || /type\s+\w+\s*=/.test(codeBlock)) {
    patterns.push({
      type: 'design-pattern',
      name: 'Type Safety',
      description: 'TypeScript types/interfaces used',
      files: [filename],
      confidence: 0.95,
    });
  }
  
  if (/use[A-Z]\w+\(/.test(codeBlock)) {
    patterns.push({
      type: 'design-pattern',
      name: 'React Hooks',
      description: 'React hooks pattern detected',
      files: [filename],
      confidence: 0.9,
    });
  }
  
  // Anti-patterns
  if (/console\.(log|error|warn)/.test(codeBlock)) {
    patterns.push({
      type: 'anti-pattern',
      name: 'Console Logging',
      description: 'Console statements in production code',
      files: [filename],
      confidence: 0.8,
    });
    debtItems.push('Remove console statements');
  }
  
  if (/any\s*[;,\)]/.test(codeBlock) && language === 'TypeScript') {
    patterns.push({
      type: 'anti-pattern',
      name: 'Any Type',
      description: 'TypeScript any type used',
      files: [filename],
      confidence: 0.7,
    });
    debtItems.push('Replace any types with proper types');
    suggestions.push('Consider using unknown or proper type definitions instead of any');
  }
  
  if (/\bTODO\b|\bFIXME\b|\bHACK\b/.test(codeBlock)) {
    debtItems.push('Address TODO/FIXME comments');
    suggestions.push('Review and address TODO/FIXME comments before merging');
  }
  
  // Architectural patterns
  if (/export\s+(default\s+)?function\s+\w+|export\s+const\s+\w+\s*=/.test(codeBlock)) {
    patterns.push({
      type: 'architectural',
      name: 'Module Pattern',
      description: 'ES6 module exports used',
      files: [filename],
      confidence: 0.95,
    });
  }
  
  if (/async\s+function|async\s*\(|\.then\(|await\s+/.test(codeBlock)) {
    patterns.push({
      type: 'architectural',
      name: 'Async/Await',
      description: 'Asynchronous programming pattern',
      files: [filename],
      confidence: 0.9,
    });
  }
  
  return { patterns, suggestions, debtItems };
}

function deduplicatePatterns(patterns: any[]): any[] {
  const seen = new Map();
  
  for (const pattern of patterns) {
    const key = `${pattern.type}-${pattern.name}`;
    if (seen.has(key)) {
      const existing = seen.get(key);
      existing.files = Array.from(new Set([...existing.files, ...pattern.files]));
      existing.confidence = Math.max(existing.confidence, pattern.confidence);
    } else {
      seen.set(key, pattern);
    }
  }
  
  return Array.from(seen.values());
}

function calculateDebtScore(items: string[]): number {
  // Simple scoring: each item adds to debt
  const score = items.length * 10;
  return Math.min(100, score); // Cap at 100
}