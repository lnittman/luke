import { pgTable, text, uuid, timestamp, jsonb, boolean, integer, unique } from 'drizzle-orm/pg-core';

// Keep the basic schema tables for backward compatibility
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').notNull().unique(),
  summary: text('summary').notNull(),
  bullets: jsonb('bullets').$type<string[]>().notNull(),
  rawData: jsonb('raw_data').notNull(),
  metadata: jsonb('metadata').$type<{
    totalCommits?: number;
    totalPullRequests?: number;
    totalIssues?: number;
    totalRepos?: number;
    languages?: string[];
    topProjects?: string[];
  }>(),
  processed: boolean('processed').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const activityDetails = pgTable('activity_details', {
  id: uuid('id').defaultRandom().primaryKey(),
  logId: uuid('log_id').references(() => activityLogs.id, { onDelete: 'cascade' }).notNull(),
  type: text('type').$type<'commit' | 'pr' | 'issue' | 'review'>().notNull(),
  title: text('title').notNull(),
  description: text('description'),
  url: text('url'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Enhanced schema tables for advanced features
export const repositories = pgTable('repositories', {
  id: uuid('id').defaultRandom().primaryKey(),
  owner: text('owner').notNull(),
  name: text('name').notNull(),
  fullName: text('full_name').notNull(),
  description: text('description'),
  language: text('language'),
  defaultBranch: text('default_branch').default('main'),
  isPrivate: boolean('is_private').default(false),
  analysisEnabled: boolean('analysis_enabled').default(true).notNull(),
  analysisDepth: text('analysis_depth').$type<'basic' | 'standard' | 'deep'>().default('deep'),
  stars: integer('stars').default(0),
  topics: jsonb('topics').$type<string[]>().default([]),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  uniqueRepo: unique().on(table.owner, table.name),
}));

export const analysisRules = pgTable('analysis_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  repositoryId: uuid('repository_id').references(() => repositories.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  description: text('description'),
  enabled: boolean('enabled').default(true).notNull(),
  priority: integer('priority').default(0).notNull(),
  ruleType: text('rule_type').$type<'prompt' | 'pattern' | 'focus' | 'ignore'>().notNull(),
  ruleContent: text('rule_content').notNull(),
  applyTo: jsonb('apply_to').$type<{
    commits?: boolean;
    pullRequests?: boolean;
    issues?: boolean;
    reviews?: boolean;
    branches?: string[];
    filePatterns?: string[];
  }>().default({
    commits: true,
    pullRequests: true,
    issues: true,
    reviews: true,
  }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

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

// Extended tables (mapped to basic tables for now to maintain compatibility)
export const activityLogsExtended = activityLogs;
export const activityDetailsExtended = activityDetails;

// Type exports for UI components
export type ActivityLog = typeof activityLogs.$inferSelect;
export type ActivityDetail = typeof activityDetails.$inferSelect;