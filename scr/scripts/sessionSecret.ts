import * as crypto from 'crypto';
import * as chalk from 'chalk';

const secret = crypto.randomBytes(64).toString('hex');

console.log(`
SESSION_SECRET for .env
${chalk.underline(secret)}
`);
