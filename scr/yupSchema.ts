import * as yup from 'yup';

import { passwordAlert } from './alertMessages/passwordAlert';
export const passwordYup = yup
  .string()
  .required(passwordAlert.required)
  .min(8, passwordAlert.short)
  .max(255, passwordAlert.long);
