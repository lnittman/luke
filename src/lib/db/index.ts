import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './schema';

// Declare global cache
declare global {
  var _db: ReturnType<typeof drizzle> | undefined;
  var _sql: ReturnType<typeof neon> | undefined;
}

// Create database connection lazily to avoid build-time errors
function createDb() {
  const databaseUrl = process.env.DATABASE_URL;
  
  // If no database URL or it's a placeholder, return a mock for build time
  if (!databaseUrl || databaseUrl === 'postgresql://user:password@host:port/db' || !databaseUrl.startsWith('postgresql://')) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('DATABASE_URL not configured properly, using mock database');
    }
    const mockSql = new Proxy({}, {
      get: () => () => Promise.resolve({ rows: [] })
    }) as any;
    return drizzle(mockSql, { schema });
  }
  
  // Create or reuse connection
  if (!global._sql) {
    global._sql = neon(databaseUrl);
  }
  
  if (!global._db) {
    global._db = drizzle(global._sql, { schema });
  }
  
  return global._db;
}

export const db = createDb();

export * from './schema';