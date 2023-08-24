import { PrismaClient } from '@prisma/client';
import { UserService } from '../src/service/UserService';

const prisma = new PrismaClient();

const userService = new UserService();

async function main() {
  const users = [
    {
      email: 'user1@example.com',
      password: userService.encrypt('password1'),
      name: 'User 1',
    },
    {
      email: 'user2@example.com',
      password: userService.encrypt('password2'),
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
