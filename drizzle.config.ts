import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_l1YTQund5vFo@ep-muddy-dream-bdomqin4-pooler.c-8.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
  },
});
