// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

// Dependencies
import * as faker from 'faker';
import * as bcrypt from 'bcrypt';

// Setup
import { redis } from '../../../database/redis';
import { prisma } from '../../../database/prisma';
import { confirmEmailLink } from './confirmEmailLink';

//Create user
let userId = '';
beforeAll(async () => {
  const user = await prisma.users.create({
    data: {
      email: faker.internet.email(),
      userName: faker.name.firstName(),
      password: bcrypt.hashSync(
        'Test123!',
        bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS))
      ),
      confirmed: false,
      locked: false,
      profilePicturePath: '/img/no_prfile_picture.png',
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
    },
  });
  userId = user.id;
});

// Shut down redis and prisma after tests
afterAll(async () => {
  redis.disconnect(), prisma.$disconnect();
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
