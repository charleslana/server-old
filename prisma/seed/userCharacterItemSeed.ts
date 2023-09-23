import { PrismaClient, UserCharacterItem } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userCharacterItems = [
    {
      userCharacterId: 1,
      itemId: 1,
    },
    {
      userCharacterId: 1,
      itemId: 2,
    },
    {
      userCharacterId: 1,
      itemId: 3,
    },
    {
      userCharacterId: 1,
      itemId: 1,
      equipped: true,
    },
    {
      userCharacterId: 1,
      itemId: 2,
    },
    {
      userCharacterId: 1,
      itemId: 3,
    },
  ] as UserCharacterItem[];

  for (const userCharacterItem of userCharacterItems) {
    await prisma.userCharacterItem.create({
      data: userCharacterItem,
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
