import { PrismaClient, User } from '@prisma/client';
import { UserService } from '../../src/service/UserService';

const prisma = new PrismaClient();

const userService = new UserService();

async function main() {
  const currentDate = new Date();
  currentDate.setDate(currentDate.getDate() + 1);
  const users = [
    {
      email: 'email@email.com',
      password: userService.encrypt('123456'),
      name: 'User 1',
    },
    {
      email: 'email2@email.com',
      password: userService.encrypt('123456'),
      name: 'User 2',
      bannedTime: currentDate,
    },
    {
      email: 'email3@email.com',
      password: userService.encrypt('123456'),
      name: 'User 3',
    },
  ] as User[];

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    await prisma.user.create({
      data: {
        ...user,
        roles: {
          create: {
            name: i === 0 ? 'admin' : 'user',
          },
        },
      },
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
