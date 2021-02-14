import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import { getConnectionOptions, createConnection } from 'typeorm';

export const startTestTypeorm = async (resetDB: boolean = false) => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({
    ...connectionOptions,
    synchronize: resetDB,
    dropSchema: resetDB,
  });
};
