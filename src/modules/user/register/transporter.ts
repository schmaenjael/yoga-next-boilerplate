import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const nodemailer = require('nodemailer');

export const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_HOST,
  auth: {
    user: process.env.EMAIL_EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});
