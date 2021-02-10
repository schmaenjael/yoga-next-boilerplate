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
import { confirmEmailLink } from '../register/confirmEmailLink';
import { TestClient } from '../../../utils/TestClient';

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

    const user: any = await prisma.users.findUnique({ where: { id: userId } });
    expect(user.confirmed).toBe(true);
  });
});
