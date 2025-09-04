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
    return {
      message: commit.commit.message,
      files: commit.files || [],
      stats: commit.stats || {},
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

