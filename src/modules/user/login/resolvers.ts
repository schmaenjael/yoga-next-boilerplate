// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });
// Dependencies
import * as bcrypt from 'bcrypt';
import * as yup from 'yup';

// Imports
import { userSessionIdPrefix } from '../../../constants';

// Utils
import { ResolverMap } from '../../../types/graphql-utils';
import { formatYupError } from '../../../utils/formatYuperror';

// Alerts
import { emailAlert } from '../../../alertMessages/emailAlert';
import { severity } from '../../../alertMessages/severity';
import { alertTitle } from '../../../alertMessages/alertTitle';

// Database
import { User } from '../../../database/entity/User';

// Yup schema
const { password } = require('../../../utils/yupSchema');
const schema = yup.object().shape({
  email: yup
    .string()
    .required(emailAlert.required)
    .min(3, emailAlert.short)
    .max(255, emailAlert.long)
    .email(emailAlert.invalid),
  password: password,
});

// Login resolver
export const resolvers: ResolverMap = {
  Query: {
    login: async (_, args, { redis, session, req }): Promise<any> => {
      try {
        await schema.validate(args, { abortEarly: false });
      } catch (err) {
        return formatYupError(err);
      }
      let { email, password } = args;
      const user = await User.findOne({
        where: { email: email },
      });

      if (!user) {
        return [
          {
            severity: severity.error,
            title: alertTitle.error,
            path: 'email or password',
            message: emailAlert.emailOrPasswordWrong,
          },
        ];
      }

      const checkPassword: boolean = bcrypt.compareSync(
        password,
        user.password
      );

      if (!checkPassword) {
        return [
          {
            severity: severity.error,
            title: alertTitle.error,
            path: 'email or password',
            message: emailAlert.emailOrPasswordWrong,
          },
        ];
      }

      if (user.locked) {
        return [
          {
            severity: severity.error,
            title: alertTitle.error,
            path: 'email',
            message: emailAlert.locked,
          },
        ];
      }

      if (!user.confirmed) {
        return [
          {
            severity: severity.error,
            title: alertTitle.error,
            path: 'email',
            message: emailAlert.confirm,
          },
        ];
      }

      // Create new session
      session.userId = user.id;
      if (req.sessionID) {
        await redis.lpush(`${userSessionIdPrefix}${user.id}`, req.sessionID);
      }

      return null;
      /*Return welcome message[
        {
          severity: severity.succes,
          title: 'Weclome',
          path: '',
          message: `Welcome ${user.userName}!`,
        },
      ];*/
    },
  },
};
