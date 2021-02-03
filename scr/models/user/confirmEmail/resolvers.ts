// Envoierment variables

// Imports

// Utils
import { ResolverMap } from '../../../types/graphql-utils';

// Database

//confirmEmail resolver
export const resolvers: ResolverMap = {
  Mutation: {
    confirmEmail: async (_, { token }, { redis }) => {
      /*
      const userId = await redis.get(token);
      if (!userId) {
        return [
          {
            severity: severityError,
            path: 'token',
            message: tokenError.expired,
          },
        ];
      }
      await User.update(
        {
          confirmed: true,
        },
        { where: { id: userId } }
      );
      await redis.del(token);
      */
      //return [{}] confirmed email....
    },
  },
};
