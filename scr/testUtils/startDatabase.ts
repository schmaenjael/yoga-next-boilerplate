import { getConnectionOptions, createConnection } from 'typeorm';

export const startTestTypeorm = async (resetDB: boolean = false) => {
  const connectionOptions = await getConnectionOptions(process.env.NODE_ENV);
  return createConnection({
    ...connectionOptions,
    name: 'default',
    synchronize: resetDB,
    dropSchema: resetDB,
  });
};
