import 'dotenv/config';
import * as session from 'express-session';
import * as connectRedis from 'connect-redis';
import * as RateLimit from 'express-rate-limit';
import * as RateLimitRedisStore from 'rate-limit-redis';
import * as chalk from 'chalk';

import { startRedis } from './database/startRedis';
import { redisSessionPrefix } from './constants';
import { setupServer } from './setupServer';
import { startTypeorm } from './database/startTypeorm';
import { startTestTypeorm } from './testUtils/startTestTypeorm';

const RedisStore = connectRedis(session as any);

export async function startServer() {
  const redis = await startRedis();
  if (process.env.NODE_ENV === 'test') {
    await redis.flushall();
  }

  const server = await setupServer(redis);

  server.express.use(
    RateLimit({
      store: new RateLimitRedisStore({
        client: redis,
      }),
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );

  server.express.use(
    session({
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix,
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
    } as any),
  );

  const cors = {
    credentials: true,
    origin:
      process.env.NODE_ENV === 'development'
        ? '*'
        : (process.env.CLIENT_PORT as string),
  };

  if (process.env.NODE_ENV === 'test') {
    await startTestTypeorm(true);
  } else {
    await startTypeorm();
  }

  const app = await server.start(
    {
      cors,
      port: process.env.NODE_ENV === 'test' ? 0 : 4000,
    },
    () => {
      console.log(
        chalk.green(
          `[*] Started server in ${chalk.underline(
            process.env.NODE_ENV,
          )} mode at ${chalk.underline(
            `http://${process.env.HOST}:${process.env.SERVER_PORT}`,
          )}`,
        ),
      );
    },
  );

  return app;
}
