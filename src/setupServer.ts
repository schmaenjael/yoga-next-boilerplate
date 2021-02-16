import 'dotenv/config';
import { GraphQLServer } from 'graphql-yoga';

import { genSchema } from './utils/genSchema';
import { authMiddleware } from './utils/authMiddleware';

export async function setupServer(redis: any) {
  const server = new GraphQLServer({
    middlewares: [authMiddleware],
    schema: genSchema(),
    context: ({ request }) => ({
      redis,
      url: request.protocol + '://' + request.get('host'),
      session: request.session,
      req: request,
    }),
  });
  return server;
}
