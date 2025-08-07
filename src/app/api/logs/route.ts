import { NextRequest, NextResponse } from 'next/server';
import { db, activityLogs, activityDetails } from '@/lib/db';
import { desc, eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch logs with pagination
    const logs = await db
      .select()
      .from(activityLogs)
      .orderBy(desc(activityLogs.date))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      logs,
      hasMore: logs.length === limit,
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

// Get a specific log by ID
export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Log ID is required' },
        { status: 400 }
      );
    }

    // Fetch the log
    const [log] = await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.id, id))
      .limit(1);

    if (!log) {
      return NextResponse.json(
        { error: 'Log not found' },
        { status: 404 }
      );
    }

    // Fetch associated details
    const details = await db
      .select()
      .from(activityDetails)
      .where(eq(activityDetails.logId, id))
      .orderBy(desc(activityDetails.createdAt));

    return NextResponse.json({
      log,
      details,
    });
  } catch (error) {
    console.error('Error fetching log details:', error);
    return NextResponse.json(
      { error: 'Failed to fetch log details' },
      { status: 500 }
    );
  }
}