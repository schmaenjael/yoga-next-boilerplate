import 'dotenv/config';
import { GraphQLServer } from 'graphql-yoga';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as RateLimit from 'express-rate-limit';
import * as RateLimitRedisStore from 'rate-limit-redis';
import * as chalk from 'chalk';

import * as redis from './database/redis';
import { prisma } from './database/prisma';
//import { genSchema } from './utils/genSchema';
//import { authMiddleware } from './utils/authMiddleware';

const RedisStore = connectRedis(session as any);

const typeDefs = `
  type Query {
    hello(name: String): String!
  }
`;

const resolvers = {
  Query: {
    hello: (_: any, { name }: any) => `Hello ${name || 'World'}`,
  },
};

/**
 * Auth middelware for scpecial queries/mutations that require authentication
 * genSchema merges typesDefs and resolvers from the models/ folder together
 * context gives redis and url for e.g the confirmation link without any dotenv configuration
 */
export const server = new GraphQLServer({
  //middlewares: [authMiddleware],
  //schema: genSchema(),
  typeDefs,
  resolvers,
  context: ({ request }) => ({
    redis,
    prisma,
    url: request.protocol + '://' + request.get('host'),
    session: request.session,
    req: request,
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

server.express.use(
  session({
    store: new RedisStore({
      client: redis as any,
    }),
    name: 'zid',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  } as any)
);

const cors = {
  credentials: true,
  origin:
    process.env.NODE_ENV === 'development' ? '*' : process.env.CLIENT_PORT,
};

export default async function startServer() {
  await server
    .start({ cors, port: process.env.SERVER_PORT })
    .then(() => {
      console.log(
        chalk.green(
          `[*] Started server in ${
            process.env.NODE_ENV
          } mode at ${chalk.underline(
            `http://${process.env.HOST}:${process.env.SERVER_PORT}`
          )}`
        )
      );
    })
    .catch((err) => {
      console.error(chalk.red('[/] Unable to start the server'), err);
    });
}
