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
import { TestClient } from '../../../utils/TestClient';

let userId = '';
let email = faker.internet.email();
let userName = faker.name.firstName();
const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
let password = bcrypt.hashSync('Test123!', salt);
let firstName = faker.name.firstName();
let lastName = faker.name.lastName();
beforeAll(async () => {
  const user = await prisma.users.create({
    data: {
      email: email,
      userName: userName,
      password: password,
      confirmed: true,
      locked: false,
      profilePicturePath: '/img/no_prfile_picture.png',
      firstName: firstName,
      lastName: lastName,
    },
  });
  userId = user.id;
});

// Shut down redis and prisma after tests
afterAll(async () => {
  redis.disconnect(), prisma.$disconnect();
});

// Me tests
describe('Me', () => {
  test('Check if cookie aviable', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    const response = await client.me();
    expect(response.data.me).toBeNull();
  });

  test('Get user', async () => {
    const client = new TestClient(process.env.TEST_HOST as string);
    await client.login(email, password);
    const response = await client.me();

    expect(response.data).toEqual({
      me: {
        id: userId,
        email: email,
        userName: userName,
        profilePicturePath: '/img/no_prfile_picture.png',
        firstName: firstName,
        lastName: lastName,
      },
    });
  });
});
