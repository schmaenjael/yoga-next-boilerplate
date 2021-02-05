// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

const transporter = require(path.join(
  __dirname,
  '..',
  '..',
  '..',
  'utils',
  'transporter'
));

export const sendConfirmEmail = async (email: string, url: string) => {
  await transporter.sendMail({
    from: `"${process.env.EMAIL_USER}"<${process.env.EMAIL_EMAIL}>`,
    to: email,
    subject: `[${process.env.EMAIL_USER}] Confirm email`,
    text: 'Please confirm your account to login: ',
    html: `<a href=${url}>${url}</a>`,
  });
};
