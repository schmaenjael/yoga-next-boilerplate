// Envoierment variables
import * as path from 'path';
import * as dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '..', '..', '..', '.env') });

// Dependencies
import * as faker from 'faker';
import { Connection } from 'typeorm';
import { User } from '../../../database/entity/User';

// Setup
import { TestClient } from '../../../utils/TestClient';
import { startTestTypeorm } from '../../../testUtils/startTestTypeorm';

// Alerts
import { emailAlert } from '../../../alertMessages/emailAlert';
import { userNameAlert } from '../../../alertMessages/userNameAlert';
import { passwordAlert } from '../../../alertMessages/passwordAlert';
import { severity } from '../../../alertMessages/severity';
import { alertTitle } from '../../../alertMessages/alertTitle';

let conn: Connection;
beforeAll(async () => {
  conn = await startTestTypeorm();
});
afterAll(async () => {
  conn.close();
});

// Create client
const client = new TestClient(process.env.TEST_HOST as string);

// Register tests
describe('Register', () => {
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
        title: alertTitle.info,
        path: 'email',
        message: emailAlert.confirm,
      },
    });
    // Check if new created user is in database
    const user: any = await User.findOne({
      where: { email: email },
    });
    expect(user).toHaveLength(1);
    expect(user.email).toEqual(email);
    expect(user.password).not.toEqual(password);

    const response0 = await client.register(
      email,
      userName,
      password,
      password
    );
    expect(response0.data.register).toHaveLength(1);
    expect(response0.data.register[0]).toEqual({
      severity: severity.error,
      title: alertTitle.error,
      path: 'email',
      message: emailAlert.taken,
    });
  });

  it('Check for duplicate usernames', async () => {
    let email = faker.internet.email();
    let userName = faker.internet.userName();
    let password = 'Test123!';
    // Send response wit correct data
    const response1 = await client.register(
      email,
      userName,
      password,
      password
    );
    // Check response
    expect(response1.data).toEqual({
      register: {
        severity: severity.info,
        title: alertTitle.info,
        path: 'email',
        message: emailAlert.confirm,
      },
    });
    // Check if new created user is in database
    const user: any = await User.findOne({
      where: { userName: userName },
    });
    expect(user).toHaveLength(1);
    expect(user.userName).toEqual(userName);
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
      title: alertTitle.error,
      path: 'username',
      message: userNameAlert.taken,
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

  describe('Username yup', () => {
    it('Required', async () => {
      const response7 = await client.register(
        faker.internet.email(),
        '',
        'Test123!',
        'Test123!'
      );
      expect(response7.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'userName',
          message: userNameAlert.required,
        },
      });
    });

    it('Short', async () => {
      const response8 = await client.register(
        faker.internet.email(),
        'aa',
        'Test123!',
        'Test123!'
      );
      expect(response8.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'userName',
          message: userNameAlert.short,
        },
      });
    });
    it('Long', async () => {
      const response9 = await client.register(
        faker.internet.email(),
        `${'a'.repeat(256)}`,
        'Test123!',
        'Test123!'
      );
      expect(response9.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'userName',
          message: userNameAlert.long,
        },
      });

      it('Invalid', async () => {
        const response10 = await client.register(
          faker.internet.email(),
          '123_',
          'Test123!',
          'Test123!'
        );
        expect(response10.data).toEqual({
          register: {
            severity: severity.error,
            title: alertTitle.error,
            path: 'userName',
            message: userNameAlert.required,
          },
        });
      });
    });
  });

  describe('Password yup', () => {
    it('Required', async () => {
      const response11 = await client.register(
        faker.internet.email(),
        faker.internet.userName(),
        '',
        'Test123!'
      );
      expect(response11.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'password',
          message: passwordAlert.required,
        },
      });
    });

    it('Short', async () => {
      const response12 = await client.register(
        faker.internet.email(),
        faker.internet.userName(),
        'Test123',
        'Test123!'
      );
      expect(response12.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'password',
          message: passwordAlert.short,
        },
      });
    });
    it('Long', async () => {
      const response13 = await client.register(
        faker.internet.email(),
        faker.internet.userName(),
        `${'a'.repeat(256)}`,
        'Test123!'
      );
      expect(response13.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'password',
          message: passwordAlert.long,
        },
      });
    });

    it('Confrimpassword required', async () => {
      const response14 = await client.register(
        faker.internet.email(),
        faker.internet.userName(),
        'Test123!',
        ''
      );
      expect(response14.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'confirmPassword',
          message: passwordAlert.confirm.required,
        },
      });
    });
    it('Confrimpassword unequal', async () => {
      const response15 = await client.register(
        faker.internet.email(),
        faker.internet.userName(),
        'Test123!',
        'Test123'
      );
      expect(response15.data).toEqual({
        register: {
          severity: severity.error,
          title: alertTitle.error,
          path: 'confirmPassword',
          message: passwordAlert.confirm.unequal,
        },
      });
    });
  });
});
