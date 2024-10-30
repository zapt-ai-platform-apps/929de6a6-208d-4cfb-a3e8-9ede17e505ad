import { pgTable, serial, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const channels = pgTable('channels', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  userId: uuid('user_id').notNull(),
  username: text('username').notNull(),
  channelId: serial('channel_id').notNull(),
});