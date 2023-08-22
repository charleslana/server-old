import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      email: 'user1@example.com',
      password: await bcrypt.hash('password1', 10),
      name: 'User 1',
    },
    {
      email: 'user2@example.com',
      password: await bcrypt.hash('password2', 10),
      name: 'User 2',
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
