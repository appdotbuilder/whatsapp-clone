import { initTRPC } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';

// Import schemas
import {
  createUserInputSchema,
  updateUserInputSchema,
  findUserByPhoneInputSchema,
  createConversationInputSchema,
  getUserConversationsInputSchema,
  createMessageInputSchema,
  getConversationMessagesInputSchema,
  markMessageReadInputSchema
} from './schema';

// Import handlers
import { createUser } from './handlers/create_user';
import { updateUser } from './handlers/update_user';
import { findUserByPhone } from './handlers/find_user_by_phone';
import { createConversation } from './handlers/create_conversation';
import { getUserConversations } from './handlers/get_user_conversations';
import { createMessage } from './handlers/create_message';
import { getConversationMessages } from './handlers/get_conversation_messages';
import { markMessageRead } from './handlers/mark_message_read';
import { updateUserOnlineStatus } from './handlers/update_user_online_status';
import { z } from 'zod';

const t = initTRPC.create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

const appRouter = router({
  // Health check endpoint
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // User management routes
  createUser: publicProcedure
    .input(createUserInputSchema)
    .mutation(({ input }) => createUser(input)),

  updateUser: publicProcedure
    .input(updateUserInputSchema)
    .mutation(({ input }) => updateUser(input)),

  findUserByPhone: publicProcedure
    .input(findUserByPhoneInputSchema)
    .query(({ input }) => findUserByPhone(input)),

  updateUserOnlineStatus: publicProcedure
    .input(z.object({
      userId: z.number(),
      isOnline: z.boolean()
    }))
    .mutation(({ input }) => updateUserOnlineStatus(input.userId, input.isOnline)),

  // Conversation management routes
  createConversation: publicProcedure
    .input(createConversationInputSchema)
    .mutation(({ input }) => createConversation(input)),

  getUserConversations: publicProcedure
    .input(getUserConversationsInputSchema)
    .query(({ input }) => getUserConversations(input)),

  // Message management routes
  createMessage: publicProcedure
    .input(createMessageInputSchema)
    .mutation(({ input }) => createMessage(input)),

  getConversationMessages: publicProcedure
    .input(getConversationMessagesInputSchema)
    .query(({ input }) => getConversationMessages(input)),

  markMessageRead: publicProcedure
    .input(markMessageReadInputSchema)
    .mutation(({ input }) => markMessageRead(input))
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors()(req, res, next);
    },
    router: appRouter,
    createContext() {
      return {};
    },
  });
  server.listen(port);
  console.log(`TRPC server listening at port: ${port}`);
}

start();