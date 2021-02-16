import * as crypto from 'crypto';
import * as chalk from 'chalk';

const secret = crypto.randomBytes(256).toString('base64');

console.log(`
SESSION_SECRET for .env
${chalk.underline(secret)}
`);
