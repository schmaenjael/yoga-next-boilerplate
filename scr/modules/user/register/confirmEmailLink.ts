// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

import { Redis } from 'ioredis';
import { v4 } from 'uuid';

export const confirmEmailLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = v4();
  await redis.set(
    id,
    userId,
    'ex',
    parseInt(process.env.REDIS_TOKEN_EXPIRATION as string)
  );
  return `${url}/confirm/${id}`;
};
