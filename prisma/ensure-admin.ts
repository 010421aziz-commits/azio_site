import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();
const email = process.env.ADMIN_EMAIL || '010421aziz@gmail.com';
const password = process.env.ADMIN_PASSWORD;

async function main() {
  if (!password) throw new Error('ADMIN_PASSWORD is required to start the application');

  const existing = await db.admin.findUnique({ where: { email } });
  if (existing) {
    console.log(`Admin account already exists: ${email}`);
    return;
  }

  await db.admin.create({
    data: {
      email,
      password: await bcrypt.hash(password, 12),
      name: 'Quran Academy',
    },
  });
  console.log(`Admin account created: ${email}`);
}

main()
  .catch((error) => {
    console.error('Unable to ensure admin account', error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());