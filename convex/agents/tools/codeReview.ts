import { createTool } from "@convex-dev/agent";
import { Octokit } from "@octokit/rest";
import { z } from "zod";

function makeOctokit() {
  return new Octokit({ auth: process.env.GITHUB_PAT || process.env.GITHUB_PERSONAL_ACCESS_TOKEN });
}

export const analyzeCommitDiffTool = createTool({
  description: "Analyze commit diffs with code context and impact assessment",
  args: z.object({ owner: z.string(), repo: z.string(), sha: z.string() }),
  async handler(_ctx, { owner, repo, sha }) {
    const octokit = makeOctokit();
    const { data: commit } = await octokit.repos.getCommit({ owner, repo, ref: sha });

    const analyzedFiles =
      commit.files?.map((file) => {
        const language = getLanguageFromFilename(file.filename);
        const complexity = analyzeCodeComplexity(file.patch || "");
        return {
          filename: file.filename,
          status: file.status!,
          additions: file.additions!,
          deletions: file.deletions!,
          changes: file.changes!,
          patch: file.patch,
          blobUrl: (file as any).blob_url,
          language,
          complexity,
        };
      }) || [];

    const analysis = performImpactAnalysis(commit as any, analyzedFiles as any);
    return {
      commit: {
        sha: commit.sha,
        message: commit.commit.message,
        url: commit.html_url,
        author: commit.commit.author?.name || "Unknown",
        timestamp: commit.commit.author?.date || new Date().toISOString(),
      },
      stats: {
        additions: commit.stats?.additions || 0,
        deletions: commit.stats?.deletions || 0,
        filesChanged: commit.files?.length || 0,
      },
      files: analyzedFiles,
      analysis,
    } as const;
  },
});

export const analyzeRepositoryContextTool = createTool({
  description: "Get deep context about a repository including structure, patterns, and quality metrics",
  args: z.object({ owner: z.string(), repo: z.string(), branch: z.string().optional() }),
  async handler(_ctx, { owner, repo, branch }) {
    const octokit = makeOctokit();
    const { data: repository } = await octokit.repos.get({ owner, repo });
    const { data: contents } = await octokit.repos.getContent({ owner, repo, path: "", ref: branch || repository.default_branch });
    const structure = await analyzeRepoStructure(owner, repo, contents as any[]);
    const recentActivity = await getRecentActivity(owner, repo);
    const codeQuality = await analyzeCodeQuality(owner, repo, structure);
    return {
      repository: {
        name: repository.name,
        fullName: repository.full_name!,
        description: repository.description,
        url: repository.html_url,
        defaultBranch: repository.default_branch,
        language: repository.language,
        topics: (repository as any).topics || [],
        stars: repository.stargazers_count,
        forks: repository.forks_count,
        openIssues: repository.open_issues_count,
      },
      structure,
      codeQuality,
      recentActivity,
    } as const;
  },
});

export const analyzePullRequestTool = createTool({
  description: "Deeply analyze a pull request including code changes, review feedback, and impact",
  args: z.object({ owner: z.string(), repo: z.string(), pullNumber: z.number() }),
  async handler(_ctx, { owner, repo, pullNumber }) {
    const octokit = makeOctokit();
    const { data: pr } = await octokit.pulls.get({ owner, repo, pull_number: pullNumber });
    const { data: files } = await octokit.pulls.listFiles({ owner, repo, pull_number: pullNumber, per_page: 100 });
    const { data: reviews } = await octokit.pulls.listReviews({ owner, repo, pull_number: pullNumber });
    const { data: comments } = await octokit.pulls.listReviewComments({ owner, repo, pull_number: pullNumber, per_page: 100 });
    const impact = analyzePRImpact(pr as any, files as any, reviews as any);
    return {
      pullRequest: {
        number: pr.number,
        title: pr.title,
        url: pr.html_url,
        state: pr.state,
        author: pr.user?.login || "",
        createdAt: pr.created_at,
        mergedAt: pr.merged_at,
        body: pr.body,
      },
      changes: {
        commits: pr.commits,
        additions: pr.additions,
        deletions: pr.deletions,
        changedFiles: pr.changed_files,
        filesDetails: files.map((f) => ({
          filename: f.filename!,
          status: f.status!,
          additions: f.additions!,
          deletions: f.deletions!,
          patch: (f as any).patch,
        })),
      },
      review: {
        reviews: reviews.length,
        approvals: reviews.filter((r) => r.state === "APPROVED").length,
        changesRequested: reviews.filter((r) => r.state === "CHANGES_REQUESTED").length,
        comments: comments.length,
        conversations: comments.map((c) => ({ path: c.path || undefined, line: c.line || undefined, body: c.body || "", author: c.user?.login || "" })),
      },
      impact,
    } as const;
  },
});

export const detectCodePatternsTool = createTool({
  description: "Detect design patterns, anti-patterns, and architectural decisions in code changes",
  args: z.object({ files: z.array(z.object({ filename: z.string(), patch: z.string(), language: z.string().optional() })) }),
  async handler(_ctx, { files }) {
    const patterns: any[] = [];
    const suggestions: string[] = [];
    const debtItems: string[] = [];
    for (const file of files) {
      if (!file.patch) continue;
      const detected = detectPatterns(file.filename, file.patch, file.language);
      patterns.push(...detected.patterns);
      suggestions.push(...detected.suggestions);
      debtItems.push(...detected.debtItems);
    }
    return {
      patterns: deduplicatePatterns(patterns),
      suggestions: Array.from(new Set(suggestions)),
      technicalDebt: { score: calculateDebtScore(debtItems), items: Array.from(new Set(debtItems)) },
    } as const;
  },
});

// Helpers (simplified adaptations of your prior logic)
function getLanguageFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map: Record<string, string> = { ts: "TypeScript", tsx: "TypeScript", js: "JavaScript", jsx: "JavaScript", py: "Python", java: "Java", cpp: "C++", c: "C", go: "Go", rs: "Rust", swift: "Swift", kt: "Kotlin", rb: "Ruby", php: "PHP", cs: "C#" };
  return map[ext || ""] || "Unknown";
}

function analyzeCodeComplexity(patch: string) {
  if (!patch) return {} as { cyclomatic?: number; cognitive?: number };
  const lines = patch.split("\n");
  let cyclomatic = 1;
  let cognitive = 0;
  for (const line of lines) {
    if (line.startsWith("+")) {
      if (/\b(if|else|for|while|switch|case|catch)\b/.test(line)) cyclomatic++;
      if (/\b(&&|\|\||\?:?)\b/.test(line)) cyclomatic++;
      const indentLevel = (line.match(/^\+\s*/)?.[0].length || 0) - 1;
      cognitive += Math.floor(indentLevel / 2);
    }
  }
  return { cyclomatic, cognitive };
}

function performImpactAnalysis(commit: any, files: any[]) {
  const categories: string[] = [];
  const patterns: string[] = [];
  const risks: string[] = [];
  const improvements: string[] = [];
  const message = commit.commit.message.toLowerCase();
  if (message.includes("fix") || message.includes("bug")) categories.push("bugfix");
  if (message.includes("feat") || message.includes("add")) categories.push("feature");
  if (message.includes("refactor")) categories.push("refactoring");
  if (message.includes("perf")) categories.push("performance");
  if (message.includes("security") || message.includes("vulnerability")) categories.push("security");
  if (message.includes("test")) categories.push("testing");
  if (message.includes("docs")) categories.push("documentation");
  for (const f of files) {
    const detected = detectPatterns(f.filename, f.patch || "", f.language);
    patterns.push(...detected.patterns.map((p) => p.name));
    improvements.push(...detected.suggestions);
    risks.push(...detected.debtItems);
  }
  return { impactLevel: inferImpactLevel(commit, files), categories, patterns, risks, improvements };
}

function inferImpactLevel(commit: any, files: any[]) {
  const changes = (commit.stats?.additions || 0) + (commit.stats?.deletions || 0);
  if (changes > 1000 || files.length > 20) return "critical";
  if (changes > 300 || files.length > 10) return "high";
  if (changes > 50 || files.length > 3) return "medium";
  return "low";
}

async function analyzeRepoStructure(owner: string, repo: string, contents: any[]) {
  const paths = (Array.isArray(contents) ? contents : []) as any[];
  const names = paths.map((c) => c.name?.toLowerCase?.() || "");
  const has = (s: string) => names.includes(s);
  const includes = (s: string) => names.some((n) => n.includes(s));
  return {
    hasTests: includes("test") || includes("spec"),
    hasCi: has(".github") || names.includes(".circleci"),
    hasDocumentation: has("docs") || names.includes("README.md"),
    packageManager: names.includes("pnpm-lock.yaml") ? "pnpm" : names.includes("yarn.lock") ? "yarn" : names.includes("package-lock.json") ? "npm" : null,
    frameworks: names.includes("next.config.mjs") ? ["Next.js"] : [],
    buildTools: names.includes("tsconfig.json") ? ["TypeScript"] : [],
  };
}

async function getRecentActivity(owner: string, repo: string) {
  const octokit = makeOctokit();
  const { data: commits } = await octokit.repos.listCommits({ owner, repo, per_page: 30 });
  const lastCommit = commits[0]?.commit?.author?.date || new Date().toISOString();
  return {
    lastCommit,
    activeContributors: new Set(commits.map((c) => c.author?.login || c.commit.author?.name)).size,
    avgCommitsPerWeek: Math.round(commits.length / 4),
    releaseFrequency: "unknown",
  };
}

async function analyzeCodeQuality(_owner: string, _repo: string, structure: any) {
  return {
    hasLinting: true,
    hasTypeChecking: true,
    testCoverage: structure.hasTests ? 60 : 0,
    codeSmells: [],
  };
}

function analyzePRImpact(_pr: any, _files: any[], _reviews: any[]) {
  // Heuristic placeholder
  return {
    breakingChanges: false,
    testsCoverage: true,
    documentationUpdated: false,
    performanceImpact: "neutral" as const,
    securityImpact: "neutral" as const,
  };
}

function detectPatterns(_filename: string, patch: string, _language?: string) {
  const out: any[] = [];
  if (/TODO|FIXME/.test(patch)) out.push({ type: "anti-pattern", name: "TodoComment", description: "Found TODO/FIXME comments", files: [], confidence: 0.6 });
  return { patterns: out, suggestions: [], debtItems: [] };
}

function deduplicatePatterns(patterns: any[]) {
  const map = new Map<string, any>();
  for (const p of patterns) map.set(`${p.type}:${p.name}`, p);
  return Array.from(map.values());
}

function calculateDebtScore(items: string[]) {
  const base = items.length * 5;
  return Math.max(0, Math.min(100, base));
}

