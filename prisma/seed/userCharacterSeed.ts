import { PrismaClient, UserCharacter } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userCharacter = {
    name: 'User character 1',
    gender: 'Male',
    userId: 1,
    characterId: 1,
  } as UserCharacter;

  await prisma.userCharacter.create({
    data: userCharacter,
  });
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
