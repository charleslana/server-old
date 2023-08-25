import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const characters = [
    {
      name: 'Character 1',
    },
    {
      name: 'Character 2',
    },
  ];

  for (const character of characters) {
    await prisma.character.create({
      data: character,
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
