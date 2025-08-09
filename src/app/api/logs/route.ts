import { NextRequest, NextResponse } from 'next/server';
import { db, activityLogs, activityDetails } from '@/lib/db';
import { desc, eq, and, or, isNotNull } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');
    const repoId = searchParams.get('repoId');

    // Check if database is properly configured
    if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'postgresql://user:password@host:port/db') {
      console.warn('Database not configured, returning empty logs');
      return NextResponse.json({
        logs: [],
        hasMore: false,
      });
    }

    // Build query with optional repo filter
    const whereConditions = repoId 
      ? or(
          eq(activityLogs.repositoryId, repoId),
          // Also check if this repo is mentioned in the rawData for global logs
          and(
            eq(activityLogs.logType, 'global'),
            isNotNull(activityLogs.rawData)
          )
        )
      : undefined;
    
    // Fetch logs with pagination and optional filter
    const logs = await db
      .select()
      .from(activityLogs)
      .where(whereConditions)
      .orderBy(desc(activityLogs.date))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      logs: logs || [],
      hasMore: logs?.length === limit || false,
    });
  } catch (error) {
    console.error('Error fetching logs:', error);
    // Return empty array instead of error to prevent client crash
    return NextResponse.json({
      logs: [],
      hasMore: false,
      error: 'Database connection issue',
    });
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