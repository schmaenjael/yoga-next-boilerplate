// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

// Utils
import { ResolverMap } from '../../../types/graphql-utils';

// Alerts
import { tokenAlert } from '../../../alertMessages/tokenAlert';
import { severity } from '../../../alertMessages/severity';
import { alertTitle } from '../../../alertMessages/alertTitle';
import { emailAlert } from '../../../alertMessages/emailAlert';

// Database
import { User } from '../../../database/entity/User';

// ConfirmEmail resolver
export const resolvers: ResolverMap = {
  Mutation: {
    confirmEmail: async (_, { token }, { redis }) => {
      const userId = await redis.get(token);
      if (userId == null) {
        return [
          {
            severity: severity.error,
            title: alertTitle.error,
            path: 'token',
            message: tokenAlert.expired,
          },
        ];
      }

      await User.update(
        {
          id: userId,
        },
        {
          confirmed: true,
        }
      );
      await redis.del(token);

      return [
        {
          severity: severity.success,
          title: alertTitle.success,
          path: 'email',
          message: emailAlert.confirmed,
        },
      ];
    },
  },
};
