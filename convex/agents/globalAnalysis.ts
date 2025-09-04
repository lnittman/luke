import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { openrouter } from "@openrouter/ai-sdk-provider";

export function createGlobalAnalysisAgent(instructions: string) {
  return new Agent(components.agent, {
    name: "Global Analysis Agent",
    languageModel: openrouter("openai/gpt-5") as any,
    instructions,
  });
}
