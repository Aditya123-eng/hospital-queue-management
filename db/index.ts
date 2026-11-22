import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export function isPostgresConfigured(): boolean {
  const uri = process.env.DATABASE_URL;
  return typeof uri === 'string' && uri.trim().startsWith('postgres');
}

export function getDb() {
  if (!isPostgresConfigured()) return null;
  const sql = neon(process.env.DATABASE_URL!.trim());
  return drizzle(sql, { schema });
}

export function getRawSql() {
  if (!isPostgresConfigured()) return null;
  return neon(process.env.DATABASE_URL!.trim());
}

export { schema };
