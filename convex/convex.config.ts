import workflow from "@convex-dev/workflow/convex.config";
import agent from "@convex-dev/agent/convex.config";
import crons from "@convex-dev/crons/convex.config";
import { defineApp } from "convex/server";

const app = defineApp();
app.use(workflow);
app.use(agent);
app.use(crons);

export default app;
