import { PrismaClient, UserCharacterItem } from '@prisma/client';

const prisma = new PrismaClient();

export class UserCharacterItemRepository {
  async save(userCharacterItem: UserCharacterItem): Promise<UserCharacterItem> {
    return await prisma.userCharacterItem.create({
      data: {
        ...userCharacterItem,
      },
    });
  }

  async update(
    id: number,
    data: Partial<UserCharacterItem>
  ): Promise<UserCharacterItem | null> {
    return await prisma.userCharacterItem.update({
      where: { id },
      data,
    });
  }

  async findAllUserCharacterId(
    userCharacterId: number
  ): Promise<UserCharacterItem[]> {
    return await prisma.userCharacterItem.findMany({
      where: { userCharacterId },
      include: {
        item: true,
      },
    });
  }

  async findByIdAndUserCharacterId(
    id: number,
    userCharacterId: number
  ): Promise<UserCharacterItem | null> {
    return await prisma.userCharacterItem.findUnique({
      where: { id, userCharacterId },
      include: {
        item: true,
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await prisma.userCharacterItem.delete({
      where: { id },
    });
    return !!deleted;
  }
}
