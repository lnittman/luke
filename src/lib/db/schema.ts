import { pgTable, text, timestamp, jsonb, uuid, boolean, varchar } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Repository settings
export const repositorySettings = pgTable('repository_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  repoId: varchar('repo_id', { length: 255 }).notNull().unique(), // Stable ID from discovery
  owner: varchar('owner', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 512 }).notNull(),
  description: text('description'),
  language: varchar('language', { length: 50 }),
  path: text('path').notNull(),
  enabled: boolean('enabled').default(false).notNull(),
  scope: varchar('scope', { length: 20 }).notNull(), // 'local' or 'github'
  lastActivity: timestamp('last_activity'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').notNull(),
  logType: varchar('log_type', { length: 20 }).notNull().default('global'), // 'global' or 'repository'
  repositoryId: uuid('repository_id').references(() => repositorySettings.id, { onDelete: 'cascade' }), // NULL for global logs
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
    // Additional fields for cross-repo analysis
    crossRepoPatterns?: string[];
    architectureDecisions?: string[];
    collaborationInsights?: string[];
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

// Settings table for global configuration
export const globalSettings = pgTable('global_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: jsonb('value').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export type RepositorySettings = typeof repositorySettings.$inferSelect;
export type NewRepositorySettings = typeof repositorySettings.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type ActivityDetail = typeof activityDetails.$inferSelect;
export type NewActivityDetail = typeof activityDetails.$inferInsert;
export type GlobalSettings = typeof globalSettings.$inferSelect;
export type NewGlobalSettings = typeof globalSettings.$inferInsert;