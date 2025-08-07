import { pgTable, text, timestamp, jsonb, uuid, boolean } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').notNull().unique(),
  summary: text('summary').notNull(),
  bullets: jsonb('bullets').$type<string[]>().notNull(),
  rawData: jsonb('raw_data').notNull(),
  metadata: jsonb('metadata').$type<{
    totalCommits: number;
    totalRepos: number;
    totalPullRequests: number;
    totalIssues: number;
    languages: string[];
    topProjects: string[];
  }>(),
  processed: boolean('processed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const activityDetails = pgTable('activity_details', {
  id: uuid('id').defaultRandom().primaryKey(),
  logId: uuid('log_id').references(() => activityLogs.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').notNull(), // 'commit', 'pr', 'issue', 'review', etc.
  title: text('title').notNull(),
  description: text('description'),
  url: text('url'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type ActivityDetail = typeof activityDetails.$inferSelect;
export type NewActivityDetail = typeof activityDetails.$inferInsert;