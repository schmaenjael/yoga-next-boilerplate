import { PrismaClient } from '@prisma/client';
import * as chalk from 'chalk';
const prisma = new PrismaClient({
  // Uncomment 👇 for logs
  //log: ['query', 'info', `warn`, `error`],
});
if (prisma) {
  console.log(chalk.green('[*] Started prisma'));
} else {
  console.error(chalk.red('[/] Unable to start prisma'));
}

export { prisma };
