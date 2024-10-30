import { messages } from '../drizzle/schema.js';
import { authenticateUser } from "./_apiUtils.js";
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.APP_ENV,
  initialScope: {
    tags: {
      type: 'backend',
      projectId: process.env.APP_ID
    }
  }
});

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', ['POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const user = await authenticateUser(req);
    const { content, channelId } = req.body;

    if (!content || !channelId) {
      return res.status(400).json({ error: 'Content and Channel ID are required' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const result = await db.insert(messages).values({
      content,
      userId: user.id,
      username: user.email,
      channelId,
    }).returning();

    res.status(201).json(result[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    Sentry.captureException(error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error sending message' });
    }
  }
}