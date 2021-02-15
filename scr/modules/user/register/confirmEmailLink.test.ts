// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

// Dependencies
import * as faker from 'faker';
import * as bcrypt from 'bcrypt';
import { Connection } from 'typeorm';
import { User } from '../../../database/entity/User';
import { Redis } from 'ioredis';

// Setup
import { confirmEmailLink } from './confirmEmailLink';
import { startTestTypeorm } from '../../../testUtils/startTestTypeorm';
import { startRedis } from '../../../database/startRedis';

//Create user
let userId = '';
let conn: Connection;
let redis: Redis;

beforeAll(async () => {
  redis = await startRedis();
  conn = await startTestTypeorm();
  const user = await User.create({
    email: faker.internet.email(),
    userName: faker.name.firstName(),
    password: bcrypt.hashSync(
      'Test123!',
      bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS))
    ),
    profilePicturePath: '/img/no_prfile_picture.png',
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
  }).save();
  userId = user.id;
});

afterAll(async () => {
  redis.disconnect();
  conn.close();
});

test('Check if token is stored in redis', async () => {
  const url = await confirmEmailLink(
    `http://${process.env.HOST}:${process.env.SERVER_PORT}`,
    userId,
    redis
  );

  const chunks = url.split('/');
  const token = chunks[chunks.length - 1];
  const value = await redis.get(token);
  expect(value).toBe(userId);
});
