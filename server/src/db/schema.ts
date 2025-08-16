import { serial, text, pgTable, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  phone_number: text('phone_number').notNull().unique(),
  name: text('name').notNull(),
  profile_picture: text('profile_picture'), // Nullable by default
  last_seen: timestamp('last_seen'), // Nullable by default
  is_online: boolean('is_online').notNull().default(false),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Conversations table
export const conversationsTable = pgTable('conversations', {
  id: serial('id').primaryKey(),
  user1_id: integer('user1_id').notNull().references(() => usersTable.id),
  user2_id: integer('user2_id').notNull().references(() => usersTable.id),
  last_message_id: integer('last_message_id'), // Nullable, will be set when messages exist
  last_message_at: timestamp('last_message_at'), // Nullable by default
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull()
});

// Messages table
export const messagesTable = pgTable('messages', {
  id: serial('id').primaryKey(),
  conversation_id: integer('conversation_id').notNull().references(() => conversationsTable.id),
  sender_id: integer('sender_id').notNull().references(() => usersTable.id),
  content: text('content').notNull(),
  is_read: boolean('is_read').notNull().default(false),
  sent_at: timestamp('sent_at').defaultNow().notNull(),
  read_at: timestamp('read_at') // Nullable by default
});

// Define relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  sentMessages: many(messagesTable),
  conversations1: many(conversationsTable, { relationName: 'user1Conversations' }),
  conversations2: many(conversationsTable, { relationName: 'user2Conversations' })
}));

export const conversationsRelations = relations(conversationsTable, ({ one, many }) => ({
  user1: one(usersTable, {
    fields: [conversationsTable.user1_id],
    references: [usersTable.id],
    relationName: 'user1Conversations'
  }),
  user2: one(usersTable, {
    fields: [conversationsTable.user2_id],
    references: [usersTable.id],
    relationName: 'user2Conversations'
  }),
  messages: many(messagesTable),
  lastMessage: one(messagesTable, {
    fields: [conversationsTable.last_message_id],
    references: [messagesTable.id]
  })
}));

export const messagesRelations = relations(messagesTable, ({ one }) => ({
  conversation: one(conversationsTable, {
    fields: [messagesTable.conversation_id],
    references: [conversationsTable.id]
  }),
  sender: one(usersTable, {
    fields: [messagesTable.sender_id],
    references: [usersTable.id]
  })
}));

// TypeScript types for the table schemas
export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;
export type Conversation = typeof conversationsTable.$inferSelect;
export type NewConversation = typeof conversationsTable.$inferInsert;
export type Message = typeof messagesTable.$inferSelect;
export type NewMessage = typeof messagesTable.$inferInsert;

// Export all tables and relations for proper query building
export const tables = {
  users: usersTable,
  conversations: conversationsTable,
  messages: messagesTable
};