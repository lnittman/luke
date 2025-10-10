import { components, internal } from "../_generated/api";
import { ActionCache } from "@convex-dev/action-cache";

export const repoSummaryCache: any = new ActionCache(
  components.actionCache,
  {
    action: (internal as any).agents.llm.generateRepoSummary,
    name: "repoSummary-v3", // v3: Updated suggestions schema
    ttl: 24 * 60 * 60 * 1000,
  } as any,
);

export const synthesisCache: any = new ActionCache(
  components.actionCache,
  {
    action: (internal as any).agents.llm.generateGlobalSynthesis,
    name: "globalSynthesis-v5", // v5: Allow suggestions but enforce complete objects or empty array
    ttl: 24 * 60 * 60 * 1000,
  } as any,
);
