import * as dotenv from 'dotenv';
import * as path from 'path';
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

import { createConnection, ConnectionOptions, Connection } from 'typeorm';
import { User } from './entity/User';

export const startTypeorm = async () => {
  const testConfig: ConnectionOptions = {
    name: 'development',
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'test',
    password: 'test',
    database: 'test',
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: ['migration/**/*.ts'],
    subscribers: ['subscriber/**/*.ts'],
    cli: {
      entitiesDir: 'entity',
      migrationsDir: 'migration',
      subscribersDir: 'subscriber',
    },
  };
  let connection: Connection;

  connection = await createConnection(testConfig);
  console.log(connection);
  let user = new User();
  user.email = 'a';
  user.userName = 'a';
  user.password = 'a';
  const userRepo = connection.getRepository(User);

  user = await userRepo.save(user);
  await connection.synchronize(true);
};
startTypeorm();
