import 'dotenv/config';
import { GraphQLServer } from 'graphql-yoga';
import * as RateLimit from 'express-rate-limit';
import * as RateLimitRedisStore from 'rate-limit-redis';

import * as redis from './redis/redis';
import { genSchema } from './utils/genSchema';
import { authMiddleware } from './utils/authMiddleware';

/**
 * Auth middelware for scpecial queries/mutations that require authentication
 * genSchema merges typesDefs and resolvers from the models/ folder together
 * context gives redis and url for e.g the confirmation link without any dotenv configuration
 */
export const server = new GraphQLServer({
  middlewares: [authMiddleware],
  schema: genSchema(),
  context: ({ request }) => ({
    redis,
    url: request.protocol + '://' + request.get('host'),
  }),
});

server.express.use(
  RateLimit({
    store: new RateLimitRedisStore({
      client: redis.redis,
    }),
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);
