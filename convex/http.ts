import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { workflow } from "./index";

const http = httpRouter();

http.route({
  path: "/cron/daily-analysis",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const body = await request.json().catch(() => ({} as any));
    const date = body.date || new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const workflowId = await workflow.start(ctx, internal.workflows.daily.agenticDailyAnalysis, { date });
    return new Response(JSON.stringify({ ok: true, workflowId }), { status: 200 });
  }),
});

export default http;
