import { WorkflowManager } from "@convex-dev/workflow";
import { components } from "./_generated/api";
import { ActionRetrier } from "@convex-dev/action-retrier";

export const workflow = new WorkflowManager(components.workflow);
export const retrier = new ActionRetrier(components.actionRetrier, {
  initialBackoffMs: 500,
  base: 2,
  maxFailures: 3,
});
