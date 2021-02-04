import { ValidationError } from 'yup';
const { severity, alertTitle } = require('../sharedAlertMessages.json');

export const formatYupError = (err: ValidationError) => {
  const errors: Array<{
    severity: string;
    titel: string;
    path: string | undefined;
    message: string;
  }> = [];
  err.inner.forEach((e) => {
    errors.push({
      severity: severity.error,
      titel: alertTitle.error,
      path: e.path,
      message: e.message,
    });
  });

  return errors;
};
