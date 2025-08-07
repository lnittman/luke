import { pgTable, text, uuid, timestamp, jsonb, boolean, integer, unique } from 'drizzle-orm/pg-core';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client);

// Repository configuration
export const repositories = pgTable('repositories', {
  id: uuid('id').defaultRandom().primaryKey(),
  owner: text('owner').notNull(),
  name: text('name').notNull(),
  fullName: text('full_name').notNull(), // owner/name
  description: text('description'),
  language: text('language'),
  defaultBranch: text('default_branch').default('main'),
  isPrivate: boolean('is_private').default(false),
  
  // Analysis configuration
  analysisEnabled: boolean('analysis_enabled').default(true).notNull(),
  analysisDepth: text('analysis_depth').$type<'basic' | 'standard' | 'deep'>().default('deep'),
  
  // Cached metadata
  stars: integer('stars').default(0),
  topics: jsonb('topics').$type<string[]>().default([]),
  metadata: jsonb('metadata'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  uniqueRepo: unique().on(table.owner, table.name),
}));

// Analysis rules per repository
export const analysisRules = pgTable('analysis_rules', {
  id: uuid('id').defaultRandom().primaryKey(),
  repositoryId: uuid('repository_id').references(() => repositories.id, { onDelete: 'cascade' }).notNull(),
  
  name: text('name').notNull(),
  description: text('description'),
  enabled: boolean('enabled').default(true).notNull(),
  priority: integer('priority').default(0).notNull(), // Higher = more important
  
  // Rule configuration
  ruleType: text('rule_type').$type<'prompt' | 'pattern' | 'focus' | 'ignore'>().notNull(),
  ruleContent: text('rule_content').notNull(), // The actual rule (prompt text, regex pattern, etc.)
  
  // Where to apply this rule
  applyTo: jsonb('apply_to').$type<{
    commits?: boolean;
    pullRequests?: boolean;
    issues?: boolean;
    reviews?: boolean;
    branches?: string[]; // Specific branches only
    filePatterns?: string[]; // File patterns to focus on
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

// Enhanced activity logs with repo linkage
export const activityLogsExtended = pgTable('activity_logs_extended', {
  id: uuid('id').defaultRandom().primaryKey(),
  date: timestamp('date').notNull(),
  
  // Link to repositories analyzed
  repositoryIds: jsonb('repository_ids').$type<string[]>().notNull(),
  
  // Analysis results
  summary: text('summary').notNull(),
  technicalSummary: text('technical_summary'), // Deep technical analysis
  bullets: jsonb('bullets').$type<string[]>().notNull(),
  
  // Structured insights
  insights: jsonb('insights').$type<{
    codeQuality?: {
      score: number;
      changes: string[];
      improvements: string[];
      concerns: string[];
    };
    architecture?: {
      patterns: string[];
      changes: string[];
      impact: string;
    };
    performance?: {
      optimizations: string[];
      regressions: string[];
    };
    security?: {
      fixes: string[];
      newVulnerabilities: string[];
    };
    dependencies?: {
      added: string[];
      removed: string[];
      updated: string[];
    };
    technicalDebt?: {
      added: string[];
      resolved: string[];
      score: number;
    };
  }>(),
  
  // Metrics
  metrics: jsonb('metrics').$type<{
    totalCommits: number;
    linesAdded: number;
    linesRemoved: number;
    filesChanged: number;
    languageBreakdown: Record<string, number>;
    contributorCount: number;
    averageCommitSize: number;
    complexityDelta: number;
  }>(),
  
  // Raw data with full context
  rawData: jsonb('raw_data').notNull(),
  
  // Applied rules for this analysis
  appliedRules: jsonb('applied_rules').$type<string[]>(),
  
  processed: boolean('processed').default(false).notNull(),
  processingTime: integer('processing_time'), // milliseconds
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  dateIdx: unique().on(table.date),
}));

// Enhanced activity details with deep linking
export const activityDetailsExtended = pgTable('activity_details_extended', {
  id: uuid('id').defaultRandom().primaryKey(),
  logId: uuid('log_id').references(() => activityLogsExtended.id, { onDelete: 'cascade' }).notNull(),
  repositoryId: uuid('repository_id').references(() => repositories.id).notNull(),
  
  type: text('type').$type<'commit' | 'pr' | 'issue' | 'review' | 'release' | 'branch'>().notNull(),
  
  // Core information
  title: text('title').notNull(),
  description: text('description'),
  
  // GitHub references
  githubUrl: text('github_url').notNull(),
  sha: text('sha'), // For commits
  number: integer('number'), // For PRs/Issues
  ref: text('ref'), // Branch/tag reference
  
  // Code references
  fileReferences: jsonb('file_references').$type<Array<{
    path: string;
    url: string;
    linesAdded: number;
    linesRemoved: number;
    language: string;
    changes: Array<{
      startLine: number;
      endLine: number;
      type: 'addition' | 'deletion' | 'modification';
      content?: string;
    }>;
  }>>(),
  
  // Technical analysis
  technicalAnalysis: jsonb('technical_analysis').$type<{
    complexity?: number;
    impact?: 'low' | 'medium' | 'high' | 'critical';
    category?: string[]; // ['refactor', 'feature', 'bugfix', 'performance', etc.]
    patterns?: string[]; // Design patterns detected
    antipatterns?: string[]; // Anti-patterns detected
    testCoverage?: {
      before: number;
      after: number;
      delta: number;
    };
  }>(),
  
  // Related activities (for cross-referencing)
  relatedActivityIds: jsonb('related_activity_ids').$type<string[]>(),
  
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// User preferences for analysis
export const userPreferences = pgTable('user_preferences', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().unique(), // Can be email or GitHub username
  
  // Global preferences
  defaultAnalysisDepth: text('default_analysis_depth').$type<'basic' | 'standard' | 'deep'>().default('deep'),
  focusAreas: jsonb('focus_areas').$type<string[]>().default([
    'architecture',
    'performance',
    'security',
    'code-quality',
    'technical-debt',
  ]),
  
  // Notification preferences
  dailyDigestEnabled: boolean('daily_digest_enabled').default(true),
  weeklyReportEnabled: boolean('weekly_report_enabled').default(true),
  
  // Analysis preferences
  includePrivateRepos: boolean('include_private_repos').default(true),
  includeForkedRepos: boolean('include_forked_repos').default(false),
  minCommitSize: integer('min_commit_size').default(1), // Minimum lines changed to include
  
  // AI preferences
  aiModel: text('ai_model').default('anthropic/claude-3.5-sonnet'),
  aiTemperature: integer('ai_temperature').default(7), // 0-10 scale (0.0-1.0)
  aiVerbosity: text('ai_verbosity').$type<'concise' | 'standard' | 'detailed'>().default('detailed'),
  
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});