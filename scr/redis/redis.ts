import * as Redis from 'ioredis';
import * as path from 'path';
import * as chalk from 'chalk';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.join(__dirname, '..', '.env') });

//Create redis client
export const redis = new Redis({
  host: process.env.REDIS_HOST as string,
  port: parseInt(process.env.REDIS_PORT as string) as number,
  password: process.env.REDIS_PASSWORD as string,
})
  .on('connect', function () {
    console.log(chalk.green('[*] Started redis'));
  })
  .on('error', function (error) {
    console.log(chalk.red('[/] Unable to start redis', error));
  });
