import { channels } from '../drizzle/schema.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';

import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,
});

Sentry.configureScope(scope => {
  scope.setTag("type", "backend");
  scope.setTag("projectId", process.env.APP_ID);
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const result = await db.select().from(channels);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error fetching channels:', error);
    Sentry.captureException(error);
    res.status(500).json({ error: 'Error fetching channels' });
  }
}