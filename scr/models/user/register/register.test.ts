// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

// Dependencies
import * as faker from 'faker';

// Setup
import { redis } from '../../../database/redis';
import { prisma } from '../../../database/prisma';
import { TestClient } from '../../../utils/TestClient';

// Alerts
import { emailAlert } from '../../../alertMessages/emailAlert';
import { userNameAlert } from '../../../alertMessages/userNameAlert';
import { passwordAlert } from '../../../alertMessages/passwordAlert';
import { severity } from '../../../alertMessages/severity';
import { alertTitle } from '../../../alertMessages/alertTitle';

// Shut down redis and prisma after tests
afterAll(async () => {
  redis.disconnect(), prisma.$disconnect();
});

// Create client
const client = new TestClient(
  `http://${process.env.HOST}:${process.env.CLIENT_PORT}`
);

// Register tests
describe('Register', async () => {
  it('Check for duplicate emails', async () => {
    let email = faker.internet.email();
    let userName = faker.internet.userName();
    let password = 'Test123!';
    // Send response wit correct data
    const response = await client.register(email, userName, password, password);
    // Check response
    expect(response.data).toEqual({
      register: {
        severity: severity.info,
        titel: alertTitle.info,
        path: 'email',
        message: confirm,
      },
    });
    // Check if new created user is in database
    const user: any = await prisma.users.findUnique({
      where: { email: email },
    });
    expect(user).toHaveLength(1);
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const response2 = await client.register(
      email,
      userName,
      password,
      password
    );
    expect(response2.data.register).toHaveLength(1);
    expect(response2.data.register[0]).toEqual({
      severity: severity.error,
      titel: alertTitle.error,
      path: 'email',
      message: emailAlert.taken,
    });
  });
  describe('Email yup', async () => {
    it('Required', async () => {
      const response = await client.register(
        '',
        faker.internet.userName(),
        'Test123!',
        'Test123!'
      );
      expect(response.data).toEqual({
        register: {
          severity: severity.error,
          titel: alertTitle.error,
          path: 'email',
          message: emailAlert.required,
        },
      });
    });

    it('Short', async () => {
      const response = await client.register(
        'aa',
        faker.internet.userName(),
        'Test123!',
        'Test123!'
      );
      expect(response.data).toEqual({
        register: {
          severity: severity.error,
          titel: alertTitle.error,
          path: 'email',
          message: emailAlert.short,
        },
      });
    });
    it('Long', async () => {
      const response = await client.register(
        `${'a'.repeat(126)}@${'a'.repeat(125)}.${'a'.repeat(3)}`,
        faker.internet.userName(),
        'Test123!',
        'Test123!'
      );
      expect(response.data).toEqual({
        register: {
          severity: severity.error,
          titel: alertTitle.error,
          path: 'email',
          message: emailAlert.long,
        },
      });
    });
  });
});
