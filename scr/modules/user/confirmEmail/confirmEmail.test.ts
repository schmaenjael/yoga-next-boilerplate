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
import { confirmEmailLink } from '../register/confirmEmailLink';
import { TestClient } from '../../../utils/TestClient';
import { startTestTypeorm } from '../../../testUtils/startTestTypeorm';
import { startRedis } from '../../../database/startRedis';

// Alerts
import { tokenAlert } from '../../../alertMessages/tokenAlert';
import { severity } from '../../../alertMessages/severity';
import { alertTitle } from '../../../alertMessages/alertTitle';
import { emailAlert } from '../../../alertMessages/emailAlert';

// Create client
const client = new TestClient(
  `http://${process.env.HOST}:${process.env.SERVER_PORT}`
);

// Create user
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
  conn.close();
});

let token: string = '';
let value: any = '';
describe('ConfirmEmail', () => {
  it('Check if token is stored in redis', async () => {
    const url = await confirmEmailLink(
      `http://${process.env.HOST}:${process.env.SERVER_PORT}`,
      userId,
      redis
    );
    const chunks = url.split('/');
    token = chunks[chunks.length - 1];
    value = await redis.get(token);
    expect(value).toBe(userId);
  });
  it('Check if token has expired', async () => {
    const response = await client.confirmEmail('_');
    expect(response).toBe({
      confirmEmail: {
        severity: severity.error,
        title: alertTitle.error,
        path: 'token',
        message: tokenAlert.expired,
      },
    });
  });

  it('Check if user is confirmed', async () => {
    const response = await client.confirmEmail(token);
    expect(response).toBe({
      confirmEmail: {
        severity: severity.success,
        title: alertTitle.success,
        path: 'email',
        message: emailAlert.confirmed,
      },
    });
    value = await redis.get(token);
    expect(value).toBeNull();

    const user: any = await User.findOne({ where: { id: userId } });
    expect(user.confirmed).toBe(true);
  });
});
