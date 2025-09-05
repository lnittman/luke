import { Agent } from "@convex-dev/agent";
import { components } from "../_generated/api";
import { openai } from "@ai-sdk/openai";

export function createGlobalAnalysisAgent(instructions: string, apiKey?: string) {
  // Use OpenAI SDK with OpenRouter base URL as a workaround for compatibility issues
  const model = openai("openai/gpt-5", {
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: apiKey || process.env.OPENROUTER_API_KEY || "",
  });
  
  return new Agent(components.agent, {
    name: "Global Analysis Agent",
    languageModel: model,
    instructions,
  });
}
