import { components, internal } from "../_generated/api";
import { ActionCache } from "@convex-dev/action-cache";

export const repoSummaryCache: any = new ActionCache(
  components.actionCache,
  {
    action: (internal as any).agents.llm.generateRepoSummary,
    name: "repoSummary-v4-gpt5", // v4: Switched to GPT-5
    ttl: 24 * 60 * 60 * 1000,
  } as any,
);

export const synthesisCache: any = new ActionCache(
  components.actionCache,
  {
    action: (internal as any).agents.llm.generateGlobalSynthesis,
    name: "globalSynthesis-v7-gpt5", // v7: Switched to GPT-5
    ttl: 24 * 60 * 60 * 1000,
  } as any,
);
