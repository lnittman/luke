import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { activityLogs } from '@/lib/db/schema'
import { desc, sql, and, gte, lte } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = parseInt(searchParams.get('limit') || '30')
    const search = searchParams.get('search')

    // Build query conditions
    const conditions = []
    
    if (startDate) {
      conditions.push(gte(activityLogs.date, new Date(startDate)))
    }
    
    if (endDate) {
      conditions.push(lte(activityLogs.date, new Date(endDate)))
    }
    
    if (search) {
      conditions.push(
        sql`${activityLogs.title} ILIKE ${`%${search}%`} OR ${activityLogs.summary} ILIKE ${`%${search}%`}`
      )
    }

    // Fetch logs
    const logs = await db
      .select({
        id: activityLogs.id,
        date: activityLogs.date,
        title: activityLogs.title,
        summary: activityLogs.summary,
        bullets: activityLogs.bullets,
        metadata: activityLogs.metadata,
        rawData: activityLogs.rawData,
        createdAt: activityLogs.createdAt,
      })
      .from(activityLogs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(activityLogs.date), desc(activityLogs.createdAt))
      .limit(limit)

    // Transform logs to include haiku from metadata
    const transformedLogs = logs.map(log => {
      const metadata = log.metadata as any
      return {
        ...log,
        haiku: metadata?.haiku || null,
        version: metadata?.version || 1,
        totalCommits: metadata?.totalCommits || 0,
        totalRepos: metadata?.totalRepos || 0,
        productivityScore: metadata?.productivityScore || 0,
        suggestions: metadata?.suggestions || [],
      }
    })

    return NextResponse.json({
      logs: transformedLogs,
      total: transformedLogs.length,
    })
  } catch (error: any) {
    console.error('Failed to fetch logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch logs', message: error.message },
      { status: 500 }
    )
  }
}