import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import { getConnectionOptions, createConnection } from 'typeorm';

export const startTypeorm = async () => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection(connectionOptions);
};
startTypeorm();
