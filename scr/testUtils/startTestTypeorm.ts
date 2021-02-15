import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import * as chalk from 'chalk';

import { getConnectionOptions, createConnection } from 'typeorm';

export const startTestTypeorm = async (resetDB: boolean = false) => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({
    ...connectionOptions,
    synchronize: resetDB,
    dropSchema: resetDB,
  })
    .then(() => {
      console.log(
        chalk.green(
          `[*] Started TypeORM connection to ${chalk.underline(
            process.env.TYPEORM_DATABASE_TEST,
          )} in ${process.env.NODE_ENV} mode `,
        ),
      );
    })
    .catch((err) => {
      console.log(chalk.red(`[/] Unable to start TypeORM \n ${err}`));
    });
};
