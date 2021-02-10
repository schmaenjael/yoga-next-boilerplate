// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

// Utils
import { ResolverMap } from '../../../types/graphql-utils';

// Me resolver
export const resolvers: ResolverMap = {
  Query: {
    me: async (_, __, { prisma, session }): Promise<any> => {
      const user = await prisma.users.findFirst({
        where: { id: session.userId },
      });

      return user;
    },
  },
};
