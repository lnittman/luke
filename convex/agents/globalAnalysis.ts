import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { createOpenAI } from "@ai-sdk/openai";

export function createGlobalAnalysisAgent(instructions: string, apiKey?: string) {
  // Configure OpenAI SDK to use OpenRouter
  const openrouter = createOpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey || process.env.OPENROUTER_API_KEY || "",
  });
  
  const model = openrouter("openai/gpt-5");
  
  return new Agent(components.agent, {
    name: "Global Analysis Agent",
    languageModel: model,
    instructions,
  });
}
