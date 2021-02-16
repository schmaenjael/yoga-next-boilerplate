import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '.', 'src', '.env') });

export = [
  {
    name: 'development',
    type: process.env.TYPEORM_CONNECTION_DEV,
    host: process.env.TYPEORM_HOST_DEV,
    port: process.env.TYPEORM_PORT_DEV,
    username: process.env.TYPEORM_USERNAME_DEV,
    password: process.env.TYPEORM_PASSWORD_DEV,
    database: process.env.TYPEORM_DATABASE_DEV,
    synchronize: true,
    logging: true,
    entities: ['src/database/entity/**/*.ts'],
    migrations: ['src/database/migration/**/*.ts'],
    subsrcibers: ['src/database/subsrciber/**/*.ts'],
    cli: {
      entitiesDir: 'src/database/entity',
      migrationsDir: 'src/database/migration',
      subsrcibersDir: 'src/database/subsrciber',
    },
  },
  {
    name: 'test',
    type: process.env.TYPEORM_CONNECTION_TEST,
    host: process.env.TYPEORM_HOST_TEST,
    port: process.env.TYPEORM_PORT_TEST,
    username: process.env.TYPEORM_USERNAME_TEST,
    password: process.env.TYPEORM_PASSWORD_TEST,
    database: process.env.TYPEORM_DATABASE_TEST,
    synchronize: true,
    logging: true,
    dropSchema: true,
    entities: ['src/database/entity/**/*.ts'],
    migrations: ['src/database/migration/**/*.ts'],
    subsrcibers: ['src/database/subsrciber/**/*.ts'],
    cli: {
      entitiesDir: 'src/database/entity',
      migrationsDir: 'src/database/migration',
      subsrcibersDir: 'src/database/subsrciber',
    },
  },
  {
    name: 'production',
    type: process.env.TYPEORM_CONNECTIONPRODT,
    host: process.env.TYPEORM_HOST_PROD,
    port: process.env.TYPEORM_PORT_PROD,
    username: process.env.TYPEORM_USERNAME_PROD,
    password: process.env.TYPEORM_PASSWORD_PROD,
    database: process.env.TYPEORM_DATABASE_PROD,
    synchronize: true,
    logging: false,
    entities: ['src/database/entity/**/*.ts'],
    migrations: ['src/database/migration/**/*.ts'],
    subsrcibers: ['src/database/subsrciber/**/*.ts'],
    cli: {
      entitiesDir: 'src/database/entity',
      migrationsDir: 'src/database/migration',
      subsrcibersDir: 'src/database/subsrciber',
    },
  },
];
