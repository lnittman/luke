import { createTool } from "@convex-dev/agent";
import { Octokit } from "@octokit/rest";
import { z } from "zod";

function makeOctokit() {
  return new Octokit({ auth: process.env.GITHUB_PAT || process.env.GITHUB_PERSONAL_ACCESS_TOKEN });
}

export const fetchUserActivityTool = createTool({
  description: "Fetch GitHub activity for a user on a specific date",
  args: z.object({ username: z.string(), date: z.string() }),
  async handler(_ctx, { username, date }) {
    const octokit = makeOctokit();
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    const { data: events } = await octokit.activity.listPublicEventsForUser({ username, per_page: 100 });
    const filtered = events.filter((e) => {
      const d = new Date(e.created_at!);
      return d >= startDate && d <= endDate;
    });
    const commits = filtered
      .filter((e) => e.type === "PushEvent")
      .flatMap((e) => ((e as any).payload?.commits as any[]) || []);
    const pullRequests = filtered
      .filter((e) => e.type === "PullRequestEvent")
      .map((e) => (e as any).payload?.pull_request);
    const issues = filtered
      .filter((e) => e.type === "IssuesEvent")
      .map((e) => (e as any).payload?.issue);
    const reviews = filtered
      .filter((e) => e.type === "PullRequestReviewEvent")
      .map((e) => (e as any).payload?.review);

    return { commits, pullRequests, issues, reviews, events: filtered } as const;
  },
});

export const fetchCommitDetailsTool = createTool({
  description: "Fetch detailed information about a commit",
  args: z.object({ owner: z.string(), repo: z.string(), sha: z.string() }),
  async handler(_ctx, { owner, repo, sha }) {
    const octokit = makeOctokit();
    const { data: commit } = await octokit.repos.getCommit({ owner, repo, ref: sha });
    // Return only compact metadata; no patch text to keep payloads small.
    const subject = (commit.commit.message || "").split("\n")[0].slice(0, 200);
    const files = (commit.files || []).map((f) => ({
      filename: f.filename,
      status: f.status as string,
      additions: f.additions,
      deletions: f.deletions,
      changes: f.changes,
    }));
    return {
      message: subject,
      files,
      stats: commit.stats || {},
      htmlUrl: commit.html_url,
    } as const;
  },
});

export const fetchRepoInfoTool = createTool({
  description: "Fetch information about a repository",
  args: z.object({ owner: z.string(), repo: z.string() }),
  async handler(_ctx, { owner, repo }) {
    const octokit = makeOctokit();
    const { data } = await octokit.repos.get({ owner, repo });
    return {
      name: data.name,
      description: data.description,
      language: data.language,
      topics: (data as any).topics || [],
      stars: data.stargazers_count,
    } as const;
  },
});

// PR tools
export const listPullRequestsTool = createTool({
  description: "List pull requests for a repo (optionally by state)",
  args: z.object({ owner: z.string(), repo: z.string(), state: z.enum(["open","closed","all"]).optional() }),
  async handler(_ctx, { owner, repo, state = "open" }) {
    const octokit = makeOctokit();
    const { data } = await octokit.pulls.list({ owner, repo, state, per_page: 100 });
    return data.map(pr => ({ number: pr.number, title: pr.title, state: pr.state as string, user: pr.user?.login || null, merged: !!pr.merged_at }));
  },
});

export const getPullRequestFilesTool = createTool({
  description: "Get changed files for a pull request",
  args: z.object({ owner: z.string(), repo: z.string(), number: z.number() }),
  async handler(_ctx, { owner, repo, number }) {
    const octokit = makeOctokit();
    const { data } = await octokit.pulls.listFiles({ owner, repo, pull_number: number, per_page: 100 });
    // Exclude patch text to avoid oversized tool results
    return data.map(f => ({ filename: f.filename, status: f.status as string, additions: f.additions, deletions: f.deletions, changes: f.changes }));
  },
});


// Issue tools
export const listIssuesTool = createTool({
  description: "List issues for a repo (optionally by state)",
  args: z.object({ owner: z.string(), repo: z.string(), state: z.enum(["open","closed","all"]).optional() }),
  async handler(_ctx, { owner, repo, state = "open" }) {
    const octokit = makeOctokit();
    const { data } = await octokit.issues.listForRepo({ owner, repo, state, per_page: 100 });
    return data.filter(i => !(i as any).pull_request).map(i => ({ number: i.number, title: i.title, state: i.state as string, labels: (i.labels||[] as any[]).map(l => (l as any).name) }));
  },
});
