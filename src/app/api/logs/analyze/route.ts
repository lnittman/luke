import { NextRequest, NextResponse } from 'next/server';
import { enhancedGitHubWorkflow } from '@/mastra';
import { format } from 'date-fns';

export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: true, result: null });
  }

  try {
    const { username, date } = await request.json();

    if (!username || !date) {
      return NextResponse.json(
        { error: 'Username and date are required' },
        { status: 400 }
      );
    }

    // Run the enhanced workflow
    const run = await enhancedGitHubWorkflow.createRunAsync();
    const result = await run.start({
      inputData: {
        username,
        date,
      },
    });

    return NextResponse.json({
      success: true,
      result: result.status === 'success' ? result.result : null,
    });
  } catch (error) {
    console.error('Error analyzing GitHub activity:', error);
    return NextResponse.json(
      { error: 'Failed to analyze GitHub activity' },
      { status: 500 }
    );
  }
}

// Manual trigger for testing
export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ success: true, result: null });
  }

  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username') || process.env.GITHUB_USERNAME || 'lnittman';
  const date = searchParams.get('date') || format(new Date(), 'yyyy-MM-dd');

  try {
    const run = await enhancedGitHubWorkflow.createRunAsync();
    const result = await run.start({
      inputData: {
        username,
        date,
      },
    });

    return NextResponse.json({
      success: true,
      result: result.status === 'success' ? result.result : null,
    });
  } catch (error) {
    console.error('Error analyzing GitHub activity:', error);
    return NextResponse.json(
      { error: 'Failed to analyze GitHub activity' },
      { status: 500 }
    );
  }
}