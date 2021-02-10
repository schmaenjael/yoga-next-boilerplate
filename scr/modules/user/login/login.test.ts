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
import { passwordAlert } from '../../../alertMessages/passwordAlert';
import { severity } from '../../../alertMessages/severity';
import { alertTitle } from '../../../alertMessages/alertTitle';

// Shut down redis and prisma after tests
afterAll(async () => {
  redis.disconnect(), prisma.$disconnect();
});

// Create client
const client = new TestClient(
  `http://${process.env.HOST}:${process.env.SERVER_PORT}`
);

// Login tests
describe('Login', () => {
  let email = faker.internet.email();
  let password = 'Test123!';
  it('Check for unaviable user', async () => {
    const response = await client.login(email, password);

    expect(response.data).toEqual({
      register: {
        severity: severity.error,
        title: alertTitle.error,
        path: 'email or password',
        message: emailAlert.emailOrPasswordWrong,
      },
    });
  });

  it('Check for confirmed email', async () => {
    await client.register(email, faker.internet.userName(), password, password);

    const response = await client.login(email, password);
    // Check response
    expect(response.data).toEqual({
      register: {
        severity: severity.error,
        title: alertTitle.error,
        path: 'email',
        message: emailAlert.confirm,
      },
    });
  });

  it('Check for wrong password', async () => {
    const response = await client.login(email, 'Test1234');

    expect(response.data).toEqual({
      register: {
        severity: severity.error,
        title: alertTitle.error,
        path: 'email or password',
        message: emailAlert.emailOrPasswordWrong,
      },
    });
  });

  describe('Email yup', () => {
    it('Required', async () => {
      const response3 = await client.register(
        '',
        faker.internet.userName(),
        'Test123!',
        'Test123!'
      );
      expect(response3.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'email',
          message: emailAlert.required,
        },
      });
    });

    it('Short', async () => {
      const response4 = await client.register(
        'aa',
        faker.internet.userName(),
        'Test123!',
        'Test123!'
      );
      expect(response4.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'email',
          message: emailAlert.short,
        },
      });
    });
    it('Long', async () => {
      const response5 = await client.register(
        `${'a'.repeat(126)}@${'a'.repeat(125)}.${'a'.repeat(3)}`,
        faker.internet.userName(),
        'Test123!',
        'Test123!'
      );
      expect(response5.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'email',
          message: emailAlert.long,
        },
      });
    });

    it('Invalid', async () => {
      const response6 = await client.register(
        'test',
        faker.internet.userName(),
        'Test123!',
        'Test123!'
      );
      expect(response6.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'email',
          message: emailAlert.invalid,
        },
      });
    });
  });

  describe('Password yup', () => {
    it('Required', async () => {
      const response7 = await client.register(
        faker.internet.email(),
        faker.internet.userName(),
        '',
        'Test123!'
      );
      expect(response7.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'password',
          message: passwordAlert.required,
        },
      });
    });

    it('Short', async () => {
      const response8 = await client.register(
        faker.internet.email(),
        faker.internet.userName(),
        'Test123',
        'Test123!'
      );
      expect(response8.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'password',
          message: passwordAlert.short,
        },
      });
    });
    it('Long', async () => {
      const response9 = await client.register(
        faker.internet.email(),
        `${'a'.repeat(256)}`,
        `${'a'.repeat(256)}`,
        'Test123!'
      );
      expect(response9.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'password',
          message: passwordAlert.long,
        },
      });
    });
  });
});
