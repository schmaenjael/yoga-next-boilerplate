import { ValidationError } from 'yup';
import { severity } from '../alertMessages/severity';
import { alertTitle } from '../alertMessages/alertTitle';

export const formatYupError = (err: ValidationError) => {
  const errors: Array<{
    severity: string;
    title: string;
    path: string | undefined;
    message: string;
  }> = [];
  err.inner.forEach((e) => {
    errors.push({
      severity: severity.error,
      title: alertTitle.error,
      path: e.path,
      message: e.message,
    });
  });
  return errors;
};
