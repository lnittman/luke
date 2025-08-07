import { NextRequest, NextResponse } from 'next/server';
import { enhancedGitHubWorkflow } from '@/mastra';
import { format, subDays } from 'date-fns';

export const maxDuration = 60; // 60 seconds timeout for cron job

export async function GET(request: NextRequest) {
  // Verify this is a cron job request (in production, use a secret)
  const authHeader = request.headers.get('authorization');
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get yesterday's date (since we run at 11:59 PM, we want the current day)
    const targetDate = format(new Date(), 'yyyy-MM-dd');
    const username = process.env.GITHUB_USERNAME || 'lnittman';


    // Execute the enhanced workflow
    const run = await enhancedGitHubWorkflow.createRunAsync();
    const result = await run.start({
      inputData: {
        username,
        date: targetDate,
      },
    });

    // Check if successful
    if (result.status === 'success' && result.result?.success) {
      console.log(`Successfully created log for ${targetDate}`);
      return NextResponse.json({
        success: true,
        message: `Daily log created for ${targetDate}`,
        logId: result.result?.logId || '',
      });
    } else {
      throw new Error('Failed to store activity log');
    }
  } catch (error) {
    console.error('Error in daily log cron job:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create daily log',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}