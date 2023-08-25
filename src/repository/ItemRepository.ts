import { Item, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class ItemRepository {
  async findById(id: number): Promise<Item | null> {
    return await prisma.item.findUnique({
      where: { id },
    });
  }
}
