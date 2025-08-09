const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function initDatabase() {
  try {
    console.log('Creating database tables...');
    
    // Create repositories table
    await sql`
      CREATE TABLE IF NOT EXISTS repositories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        repo_id VARCHAR(255) UNIQUE,
        owner TEXT NOT NULL,
        name TEXT NOT NULL,
        full_name TEXT NOT NULL,
        description TEXT,
        language TEXT,
        path TEXT,
        scope VARCHAR(20) DEFAULT 'github',
        default_branch TEXT DEFAULT 'main',
        is_private BOOLEAN DEFAULT false,
        analysis_enabled BOOLEAN DEFAULT true NOT NULL,
        analysis_depth TEXT DEFAULT 'deep',
        stars INTEGER DEFAULT 0,
        topics JSONB DEFAULT '[]',
        metadata JSONB,
        last_activity TIMESTAMP,
        commit_count INTEGER,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
        UNIQUE(owner, name)
      )
    `;
    
    // Create activity_logs table
    await sql`
      CREATE TABLE IF NOT EXISTS activity_logs (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        date TIMESTAMP NOT NULL,
        log_type VARCHAR(20) DEFAULT 'global' NOT NULL,
        repository_id UUID REFERENCES repositories(id) ON DELETE CASCADE,
        summary TEXT NOT NULL,
        bullets JSONB NOT NULL,
        raw_data JSONB NOT NULL,
        metadata JSONB,
        processed BOOLEAN DEFAULT false NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    
    // Create activity_details table
    await sql`
      CREATE TABLE IF NOT EXISTS activity_details (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        log_id UUID REFERENCES activity_logs(id) ON DELETE CASCADE NOT NULL,
        type TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        url TEXT,
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    
    // Create user_preferences table
    await sql`
      CREATE TABLE IF NOT EXISTS user_preferences (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        user_id TEXT NOT NULL UNIQUE,
        default_analysis_depth TEXT DEFAULT 'deep',
        focus_areas JSONB DEFAULT '["architecture","performance","security","code-quality","technical-debt"]',
        daily_digest_enabled BOOLEAN DEFAULT true,
        weekly_report_enabled BOOLEAN DEFAULT true,
        global_logs_enabled BOOLEAN DEFAULT true,
        include_private_repos BOOLEAN DEFAULT true,
        include_forked_repos BOOLEAN DEFAULT false,
        min_commit_size INTEGER DEFAULT 1,
        ai_model TEXT DEFAULT 'anthropic/claude-3.5-sonnet',
        ai_temperature INTEGER DEFAULT 7,
        ai_verbosity TEXT DEFAULT 'detailed',
        metadata JSONB,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    
    // Create global_settings table
    await sql`
      CREATE TABLE IF NOT EXISTS global_settings (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        key VARCHAR(255) NOT NULL UNIQUE,
        value JSONB NOT NULL,
        created_at TIMESTAMP DEFAULT NOW() NOT NULL,
        updated_at TIMESTAMP DEFAULT NOW() NOT NULL
      )
    `;
    
    console.log('✅ All tables created successfully!');
    
    // Insert sample log for testing
    console.log('Inserting sample log...');
    await sql`
      INSERT INTO activity_logs (date, summary, bullets, raw_data, metadata)
      VALUES (
        NOW(),
        'Initial setup of the logs system with database integration',
        '["Connected to Neon PostgreSQL database", "Created schema tables", "Configured pagination to 10 items", "Removed procedural ASCII mode"]'::jsonb,
        '{}'::jsonb,
        '{"totalCommits": 5, "totalRepos": 1, "totalPullRequests": 0, "totalIssues": 0, "languages": ["TypeScript"]}'::jsonb
      )
    `;
    console.log('✅ Sample log inserted!');
    
    // Verify
    const result = await sql`SELECT COUNT(*) as count FROM activity_logs`;
    console.log(`Total logs in database: ${result[0].count}`);
    
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

initDatabase();