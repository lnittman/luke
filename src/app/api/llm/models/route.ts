import { NextRequest, NextResponse } from 'next/server';
import { createServerApiProvider } from '@/lib/llm';

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
    const provider = createServerApiProvider();
    const availableModels = await provider.getAvailableModels();

    // Format response to match what the CLI expects
    return NextResponse.json({
      models: availableModels
    });
  } catch (error) {
    console.error('Error fetching models:', error);
    return NextResponse.json({
      error: 'Failed to fetch models',
      message: error instanceof Error ? error.message : String(error),
    }, { status: 500 });
  }
} 