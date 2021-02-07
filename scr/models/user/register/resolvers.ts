// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

// Dependencies
import * as bcrypt from 'bcrypt';
import * as yup from 'yup';

// Imports
import { confirmEmailLink } from './confirmEmailLink';
import { sendConfirmEmail } from './sendConfirmEmail';

// Utils
import { ResolverMap } from '../../../types/graphql-utils';
import { formatYupError } from '../../../utils/formatYuperror';

// Alerts
import { emailAlert } from '../../../alertMessages/emailAlert';
import { userNameAlert } from '../../../alertMessages/userNameAlert';
import { passwordAlert } from '../../../alertMessages/passwordAlert';
import { severity } from '../../../alertMessages/severity';
import { alertTitle } from '../../../alertMessages/alertTitle';

// Yup schema
const { passwordYup } = require('../../../yupSchema');
const schema = yup.object().shape({
  email: yup
    .string()
    .required(emailAlert.required)
    .min(3, emailAlert.short)
    .max(255, emailAlert.long)
    .email(),
  userName: yup
    .string()
    .required(userNameAlert.required)
    .min(3, userNameAlert.short)
    .max(255, userNameAlert.long)
    .matches(
      /^[A-Za-z](?:[a-zA-Z0-9])*(?:[_-]?[a-zA-Z0-9])*$/,
      userNameAlert.invalid
    ),
  password: passwordYup,
  confirmPassword: yup
    .string()
    .required(passwordAlert.confirm.required)
    .oneOf([yup.ref('password'), null], passwordAlert.confirm.unequal),
});

// Register resolver

export const resolvers: ResolverMap = {
  Mutation: {
    register: async (_, args, { redis, prisma, url }): Promise<any> => {
      try {
        await schema.validate(args);
      } catch (err) {
        return formatYupError(err);
      }
      let { email, userName, password } = args;
      const emailAlreadyExists = await prisma.users.findFirst({
        where: { email: email },
      });

      if (emailAlreadyExists) {
        return [
          {
            severity: severity.error,
            titel: alertTitle.error,
            path: 'email',
            message: emailAlert.taken,
          },
        ];
      }

      const userAlreadyExists = await prisma.users.findFirst({
        where: { userName: userName },
      });

      if (userAlreadyExists) {
        return [
          {
            severity: severity.error,
            titel: alertTitle.error,
            path: 'username',
            message: userNameAlert.taken,
          },
        ];
      }

      const salt: string = bcrypt.genSaltSync(
        parseInt(process.env.SALT_ROUNDS as string)
      );
      const passwordHash: string = bcrypt.hashSync(password, salt);

      let user = await prisma.users.create({
        data: {
          email: email,
          userName: userName,
          password: passwordHash,
          confirmed: true,
          locked: false,
          profilePicturePath: '',
          firstName: '',
          lastName: '',
        },
      });

      if (process.env.NODE_ENV != 'test') {
        await sendConfirmEmail(
          email,
          await confirmEmailLink(url, user.id, redis)
        );
      }

      return [
        {
          severity: severity.info,
          titel: alertTitle.info,
          path: 'email',
          message: confirm,
        },
      ];
    },
  },
};
