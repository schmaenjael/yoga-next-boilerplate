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
    parseInt(process.env.REDIS_TOKEN_EXPIRATION) as number
  );
  return `${url}/confirm/${id}`;
};
