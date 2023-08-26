import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const items = [
    {
      name: 'Item 1',
    },
    {
      name: 'Item 2',
    },
  ];

  for (const item of items) {
    await prisma.item.create({
      data: item,
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
