import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";

const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

export function createGlobalAnalysisAgent(instructions: string) {
  return new Agent(components.agent, {
    name: "Global Analysis Agent",
    languageModel: openrouter("openai/gpt-5"),
    instructions,
  });
}
