import { prisma } from '../prisma';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as faker from 'faker';
import * as bcrypt from 'bcrypt';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function main() {
  let seedAmount = parseInt(process.env.SEED_AMOUNT as string);
  while (seedAmount--) {
    const salt = bcrypt.genSaltSync(Number(process.env.SALT_ROUNDS));
    await prisma.users.create({
      data: {
        email: faker.internet.email(),
        userName: faker.name.firstName(),
        password: bcrypt.hashSync('Test123!', salt),
        confirmed: true,
        locked: false,
        profilePicturePath: '/img/no_prfile_picture.png',
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
      },
    });
  }
}
main()
  .catch((e: Error) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  });
