import { Group, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const group = {
    name: 'Group 1',
  } as Group;

  await prisma.group.create({
    data: {
      ...group,
      userCharacterGroups: {
        create: {
          userCharacterId: 1,
          role: 'leader',
        },
      },
    },
  });
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
