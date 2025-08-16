import { z } from 'zod';

// User schema
export const userSchema = z.object({
  id: z.number(),
  phone_number: z.string(),
  name: z.string(),
  profile_picture: z.string().nullable(),
  last_seen: z.coerce.date().nullable(),
  is_online: z.boolean(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Input schema for creating users
export const createUserInputSchema = z.object({
  phone_number: z.string().min(1),
  name: z.string().min(1),
  profile_picture: z.string().nullable().optional()
});

export type CreateUserInput = z.infer<typeof createUserInputSchema>;

// Input schema for updating users
export const updateUserInputSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  profile_picture: z.string().nullable().optional(),
  is_online: z.boolean().optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Conversation schema
export const conversationSchema = z.object({
  id: z.number(),
  user1_id: z.number(),
  user2_id: z.number(),
  last_message_id: z.number().nullable(),
  last_message_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type Conversation = z.infer<typeof conversationSchema>;

// Input schema for creating conversations
export const createConversationInputSchema = z.object({
  user1_id: z.number(),
  user2_id: z.number()
});

export type CreateConversationInput = z.infer<typeof createConversationInputSchema>;

// Message schema
export const messageSchema = z.object({
  id: z.number(),
  conversation_id: z.number(),
  sender_id: z.number(),
  content: z.string(),
  is_read: z.boolean(),
  sent_at: z.coerce.date(),
  read_at: z.coerce.date().nullable()
});

export type Message = z.infer<typeof messageSchema>;

// Input schema for creating messages
export const createMessageInputSchema = z.object({
  conversation_id: z.number(),
  sender_id: z.number(),
  content: z.string().min(1)
});

export type CreateMessageInput = z.infer<typeof createMessageInputSchema>;

// Input schema for marking messages as read
export const markMessageReadInputSchema = z.object({
  message_id: z.number(),
  user_id: z.number()
});

export type MarkMessageReadInput = z.infer<typeof markMessageReadInputSchema>;

// Input schema for getting conversations by user
export const getUserConversationsInputSchema = z.object({
  user_id: z.number()
});

export type GetUserConversationsInput = z.infer<typeof getUserConversationsInputSchema>;

// Input schema for getting messages in a conversation
export const getConversationMessagesInputSchema = z.object({
  conversation_id: z.number(),
  limit: z.number().optional(),
  offset: z.number().optional()
});

export type GetConversationMessagesInput = z.infer<typeof getConversationMessagesInputSchema>;

// Input schema for finding users by phone number
export const findUserByPhoneInputSchema = z.object({
  phone_number: z.string()
});

export type FindUserByPhoneInput = z.infer<typeof findUserByPhoneInputSchema>;

// Response schema for conversation with user details
export const conversationWithUsersSchema = z.object({
  id: z.number(),
  user1: userSchema,
  user2: userSchema,
  last_message: messageSchema.nullable(),
  last_message_at: z.coerce.date().nullable(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type ConversationWithUsers = z.infer<typeof conversationWithUsersSchema>;