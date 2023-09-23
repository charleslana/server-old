import { Item, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const items = [
    {
      name: 'Espada',
      description: 'Uma espada simples',
      type: 'equipment',
      equipmentType: 'weapon',
    },
    {
      name: 'Pote de recuperação de HP pequeno',
      description: 'Recupera 50 de HP',
      type: 'consumable',
      consumableType: 'hp',
    },
    {
      name: 'Item de quest',
      description: 'Descrição do item de quest',
      type: 'other',
    },
  ] as unknown as Item[];

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
