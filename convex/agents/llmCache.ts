import { components, internal } from "../_generated/api";
import { ActionCache } from "@convex-dev/action-cache";

export const repoSummaryCache: any = new ActionCache(
  components.actionCache,
  {
    action: (internal as any).agents.llm.generateRepoSummary,
    name: "repoSummary-v2", // Bumped to invalidate caches with SubstrateLabs repos
    ttl: 24 * 60 * 60 * 1000,
  } as any,
);

export const synthesisCache: any = new ActionCache(
  components.actionCache,
  {
    action: (internal as any).agents.llm.generateGlobalSynthesis,
    name: "globalSynthesis-v2", // Bumped to invalidate caches with SubstrateLabs repos
    ttl: 24 * 60 * 60 * 1000,
  } as any,
);
