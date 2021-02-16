// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

// Dependencies
import * as faker from 'faker';
import * as bcrypt from 'bcrypt';
import { Connection } from 'typeorm';
import { User } from '../../../database/entity/User';

// Setup
import { TestClient } from '../../../utils/TestClient';
import { startTestTypeorm } from '../../../testUtils/startTestTypeorm';

// User data
let userId = '';
let email = faker.internet.email();
let userName = faker.name.firstName();
const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
let password = bcrypt.hashSync('Test123!', salt);
let firstName = faker.name.firstName();
let lastName = faker.name.lastName();

let conn: Connection;
beforeAll(async () => {
  conn = await startTestTypeorm();
  const user = await User.create({
    email: email,
    userName: userName,
    password: password,
    profilePicturePath: '/img/no_prfile_picture.png',
    firstName: firstName,
    lastName: lastName,
  }).save();
  userId = user.id;
});

afterAll(async () => {
  conn.close();
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
