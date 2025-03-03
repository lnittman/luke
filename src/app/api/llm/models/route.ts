import { NextRequest, NextResponse } from 'next/server';

// Models interface
interface OpenRouterModel {
  id: string;
  name: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt?: number;
    completion?: number;
  };
}

export async function GET(request: NextRequest) {
  try {
    const openRouterApiKey = process.env.OPENROUTER_API_KEY;
    
    if (!openRouterApiKey) {
      return NextResponse.json(
        { error: 'OpenRouter API key not configured on the server.' },
        { status: 500 }
      );
    }

    // Call OpenRouter API to get available models
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'HTTP-Referer': 'https://luke-portfolio.vercel.app',
        'X-Title': 'Luke Portfolio',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      return NextResponse.json(
        { error: 'Invalid response format from OpenRouter models API' },
        { status: 500 }
      );
    }

    // Extract model IDs and ensure they're unique
    const modelIds = data.data.map((model: OpenRouterModel) => model.id);
    const uniqueModelIds = Array.from(new Set(modelIds));

    return NextResponse.json({
      models: uniqueModelIds
    });
  } catch (error) {
    console.error('Error fetching models from OpenRouter:', error);
    
    // Return default models if API call fails
    return NextResponse.json({
      models: [
        'anthropic/claude-3.7-sonnet',
        'anthropic/claude-3.7-haiku',
        'anthropic/claude-3.5-sonnet',
        'anthropic/claude-3-opus',
        'anthropic/claude-3-sonnet',
        'anthropic/claude-3-haiku',
        'google/gemini-2-flash',
        'google/gemini-2-pro',
        'google/gemini-1.5-flash',
        'google/gemini-1.5-pro',
        'openai/gpt-4o',
        'openai/gpt-4-turbo',
        'openai/gpt-3.5-turbo',
      ]
    });
  }
} 