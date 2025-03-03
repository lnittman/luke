import { NextRequest, NextResponse } from 'next/server';

export const maxDuration = 300; // 5 minutes

interface Message {
  role: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    console.log("[LLM API] Received request");
    
    const { prompt, model, temperature, maxTokens, responseFormat } = await request.json();
    console.log(`[LLM API] Request params: model=${model || 'default'}, temp=${temperature || 0.7}`);

    if (!prompt || typeof prompt !== 'string' && !Array.isArray(prompt)) {
      console.error("[LLM API] Invalid prompt format");
      return NextResponse.json(
        { error: 'Invalid prompt. Please provide a text prompt or messages array.' },
        { status: 400 }
      );
    }

    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterApiKey) {
      console.error("[LLM API] Missing OpenRouter API key");
      return NextResponse.json(
        { error: 'OpenRouter API key not configured on the server.' },
        { status: 500 }
      );
    }

    // Prepare messages (either use provided messages array or create a new one)
    let messages: Message[] = [];
    if (Array.isArray(prompt)) {
      messages = prompt;
      console.log(`[LLM API] Using provided messages array with ${messages.length} messages`);
    } else {
      // Add a system message to ensure raw JSON output when JSON format is requested
      if (responseFormat && responseFormat.type === "json_object") {
        messages = [
          { 
            role: 'system', 
            content: 'You are a helpful AI assistant that generates structured data. When asked to provide JSON, you MUST generate ONLY the raw JSON without ANY markdown formatting, code blocks, or explanations. DO NOT use backticks or ```json code blocks. The response should be a valid JSON object that can be directly parsed. Start your response with { and end with } with no other text.' 
          },
          { role: 'user', content: prompt }
        ];
        console.log(`[LLM API] Created JSON-formatted messages with stronger system prompt`);
      } else {
        messages = [{ role: 'user', content: prompt }];
        console.log(`[LLM API] Created simple user message`);
      }
    }

    // Prepare request body
    const requestBody = {
      model: model || 'anthropic/claude-3.7-sonnet',
      messages,
      temperature: temperature || 0.7,
      max_tokens: maxTokens || 4000,
      response_format: responseFormat || { type: "text" },
    };
    
    console.log(`[LLM API] Calling OpenRouter with model: ${requestBody.model}`);
    
    try {
      // Call OpenRouter API
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterApiKey}`,
          'HTTP-Referer': 'https://luke-portfolio.vercel.app',
          'X-Title': 'Luke Portfolio',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        let errorMessage = `OpenRouter API error: ${response.status}`;
        try {
          const errorText = await response.text();
          console.error(`[LLM API] OpenRouter error response: ${errorText}`);
          errorMessage += ` - ${errorText}`;
        } catch (parseError) {
          console.error(`[LLM API] Could not parse error response: ${parseError}`);
        }
        
        return NextResponse.json(
          { error: errorMessage },
          { status: response.status }
        );
      }

      const data = await response.json();
      console.log(`[LLM API] Success! Response contains ${data.choices ? data.choices.length : 0} choices`);
      return NextResponse.json(data);
    } catch (fetchError: any) {
      console.error(`[LLM API] Fetch error:`, fetchError);
      return NextResponse.json(
        { error: `Error communicating with OpenRouter: ${fetchError?.message || 'Unknown error'}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('[LLM API] Unexpected error:', error);
    return NextResponse.json(
      { error: `Failed to call LLM API: ${error?.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
} 