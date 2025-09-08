import { defineApp } from "convex/server";
import workflow from "@convex-dev/workflow/convex.config";
import actionRetrier from "@convex-dev/action-retrier/convex.config";
import actionCache from "@convex-dev/action-cache/convex.config";
import agent from "@convex-dev/agent/convex.config";
import crons from "@convex-dev/crons/convex.config";

const app = defineApp();
// Keep existing workflow component and add retrier + action cache
app.use(workflow);
app.use(agent);
app.use(crons);
app.use(actionRetrier);
app.use(actionCache);

export default app;
