// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

// Database
import { User } from '../../../database/entity/User';

// Utils
import { ResolverMap } from '../../../types/graphql-utils';

// Me resolver
export const resolvers: ResolverMap = {
  Query: {
    me: async (_, __, { session }): Promise<any> => {
      const user = await User.findOne({
        where: { id: session.userId },
        select: ['id'],
      });

      return user;
    },
  },
};
