import { pgTable, text, timestamp, jsonb, uuid, boolean, varchar, integer, unique } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// Repositories table
export const repositories = pgTable('repositories', {
  id: uuid('id').defaultRandom().primaryKey(),
  repoId: varchar('repo_id', { length: 255 }).unique(), // Stable ID from discovery
  owner: text('owner').notNull(),
  name: text('name').notNull(),
  fullName: text('full_name').notNull(),
  description: text('description'),
  language: text('language'),
  path: text('path'), // Local path for discovered repos
  scope: varchar('scope', { length: 20 }).default('github'), // 'local' or 'github'
  defaultBranch: text('default_branch').default('main'),
  isPrivate: boolean('is_private').default(false),
  analysisEnabled: boolean('analysis_enabled').default(true).notNull(),
  analysisDepth: text('analysis_depth').$type<'basic' | 'standard' | 'deep'>().default('deep'),
  stars: integer('stars').default(0),
  topics: jsonb('topics').$type<string[]>().default([]),
  metadata: jsonb('metadata'),
  lastActivity: timestamp('last_activity'),
  commitCount: integer('commit_count'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  uniqueRepo: unique().on(table.owner, table.name),
}));

export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').notNull(),
  logType: varchar('log_type', { length: 20 }).notNull().default('global'), // 'global' or 'repository'
  repositoryId: uuid('repository_id').references(() => repositories.id, { onDelete: 'cascade' }), // NULL for global logs
  title: text('title'), // Short human-readable title for the log
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

// User preferences table
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().unique(),
  defaultAnalysisDepth: text('default_analysis_depth').$type<'basic' | 'standard' | 'deep'>().default('deep'),
  focusAreas: jsonb('focus_areas').$type<string[]>().default([
    'architecture',
    'performance',
    'security',
    'code-quality',
    'technical-debt',
  ]),
  dailyDigestEnabled: boolean('daily_digest_enabled').default(true),
  weeklyReportEnabled: boolean('weekly_report_enabled').default(true),
  globalLogsEnabled: boolean('global_logs_enabled').default(true),
  includePrivateRepos: boolean('include_private_repos').default(true),
  includeForkedRepos: boolean('include_forked_repos').default(false),
  minCommitSize: integer('min_commit_size').default(1),
  aiModel: text('ai_model').default('anthropic/claude-3.5-sonnet'),
  aiTemperature: integer('ai_temperature').default(7),
  aiVerbosity: text('ai_verbosity').$type<'concise' | 'standard' | 'detailed'>().default('detailed'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Analysis rules for repositories
export const analysisRules = pgTable('analysis_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  repositoryId: uuid('repository_id').notNull().references(() => repositories.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  enabled: boolean('enabled').default(true).notNull(),
  priority: integer('priority').default(0).notNull(),
  ruleType: varchar('rule_type', { length: 50 }).notNull(),
  ruleContent: text('rule_content').notNull(),
  applyTo: jsonb('apply_to'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Settings table for global configuration
export const globalSettings = pgTable('global_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  key: varchar('key', { length: 255 }).notNull().unique(),
  value: jsonb('value').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Type exports
export type Repository = typeof repositories.$inferSelect;
export type NewRepository = typeof repositories.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type ActivityDetail = typeof activityDetails.$inferSelect;
export type NewActivityDetail = typeof activityDetails.$inferInsert;
export type GlobalSettings = typeof globalSettings.$inferSelect;
export type NewGlobalSettings = typeof globalSettings.$inferInsert;
export type UserPreferences = typeof userPreferences.$inferSelect;
export type NewUserPreferences = typeof userPreferences.$inferInsert;
export type AnalysisRule = typeof analysisRules.$inferSelect;
export type NewAnalysisRule = typeof analysisRules.$inferInsert;