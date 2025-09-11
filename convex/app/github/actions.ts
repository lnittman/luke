import { action } from "../../_generated/server";
import { v } from "convex/values";
import { Octokit } from "@octokit/rest";

export const fetchDailyActivity = action({
  args: { date: v.string() }, // YYYY-MM-DD
  handler: async (_ctx, { date }) => {
    const octokit = new Octokit({ auth: process.env.GITHUB_PAT });

    const dateObj = new Date(date);
    const startDate = new Date(dateObj);
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(dateObj);
    endDate.setUTCHours(23, 59, 59, 999);

    try {
      const { data: user } = await octokit.users.getAuthenticated();
      const username = user.login;

      const events: any[] = [];
      let page = 1;
      while (page <= 3) {
        const { data } = await octokit.activity.listEventsForAuthenticatedUser({
          username,
          per_page: 100,
          page,
        });
        if (data.length === 0) break;
        events.push(...data);
        page++;
      }

      const dayEvents = events.filter((event) => {
        const eventDate = new Date(event.created_at!);
        return eventDate >= startDate && eventDate <= endDate;
      });

      const commits: any[] = [];
      const repoSet = new Set<string>();
      for (const e of dayEvents) {
        if (e.type === "PushEvent" && e.payload) {
          const payload: any = e.payload;
          const repoName = e.repo.name;
          repoSet.add(repoName);
          if (payload.commits && Array.isArray(payload.commits)) {
            for (const c of payload.commits) {
              commits.push({
                sha: c.sha,
                message: c.message,
                repository: repoName,
                timestamp: e.created_at!,
                author: c.author?.name || username,
                url: `https://github.com/${repoName}/commit/${c.sha}`,
              });
            }
          }
        }
      }

      const pullRequests = dayEvents
        .filter((e) => e.type === "PullRequestEvent")
        .map((e) => {
          const payload: any = e.payload;
          return {
            number: payload.pull_request?.number || 0,
            title: payload.pull_request?.title || "",
            repository: e.repo.name,
            state: payload.action || "unknown",
            url: payload.pull_request?.html_url || "",
          };
        });

      const issues = dayEvents
        .filter((e) => e.type === "IssuesEvent")
        .map((e) => {
          const payload: any = e.payload;
          return {
            number: payload.issue?.number || 0,
            title: payload.issue?.title || "",
            repository: e.repo.name,
            state: payload.action || "unknown",
            url: payload.issue?.html_url || "",
          };
        });

      return {
        commits,
        pullRequests,
        issues,
        totalCommits: commits.length,
        totalRepos: repoSet.size,
        repositories: Array.from(repoSet),
      };
    } catch (error: any) {
      console.error("fetchDailyActivity failed", error?.message || error);
      return {
        commits: [],
        pullRequests: [],
        issues: [],
        totalCommits: 0,
        totalRepos: 0,
        repositories: [],
      };
    }
  },
});
