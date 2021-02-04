import { Redis } from 'ioredis';
import { PrismaClient } from '@prisma/client';

export interface Session {
  userId?: string;
}

export interface Context {
  redis: Redis;
  prisma: PrismaClient;
  url: string;
  session: Session;
  req: Express.Request;
}

export type Resolver = (
  parent: any,
  args: any,
  context: Context,
  info: any
) => any;

export interface ResolverMap {
  [key: string]: {
    [key: string]: Resolver;
  };
}
