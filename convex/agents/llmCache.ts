import { components, internal } from "../_generated/api";
import { ActionCache } from "@convex-dev/action-cache";

export const repoSummaryCache: any = new ActionCache(
  components.actionCache,
  {
    action: (internal as any)["functions/internal/llm"].generateRepoSummary,
    name: "repoSummary-v1",
    ttl: 24 * 60 * 60 * 1000,
  } as any,
);

export const synthesisCache: any = new ActionCache(
  components.actionCache,
  {
    action: (internal as any)["functions/internal/llm"].generateGlobalSynthesis,
    name: "globalSynthesis-v1",
    ttl: 24 * 60 * 60 * 1000,
  } as any,
);
