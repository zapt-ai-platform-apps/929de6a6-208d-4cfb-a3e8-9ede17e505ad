import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './drizzle/schema.js',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    url: process.env.NEON_DB_URL,
  },
});