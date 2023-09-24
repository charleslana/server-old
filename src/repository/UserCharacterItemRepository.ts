import { IGroupedItem } from '../interface/IGroupedItem';
import {
  ItemEquipmentTypeEnum,
  PrismaClient,
  UserCharacterItem,
} from '@prisma/client';

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
      include: {
        item: true,
      },
      data,
    });
  }

  async findAllUserCharacterId(
    userCharacterId: number
  ): Promise<IGroupedItem[]> {
    const items = await prisma.userCharacterItem.findMany({
      where: { userCharacterId },
      include: {
        item: true,
      },
    });
    const groupedItemsMap = new Map<number, IGroupedItem>();
    for (const item of items) {
      const { id, item: itemData } = item;
      if (itemData.type === 'equipment') {
        groupedItemsMap.set(id, { ...item, quantity: 1 });
      } else {
        if (groupedItemsMap.has(itemData.id)) {
          const existing = groupedItemsMap.get(itemData.id);
          if (existing) {
            existing.quantity += 1;
          }
        } else {
          const newItem = { ...item, quantity: 1 };
          groupedItemsMap.set(itemData.id, newItem);
        }
      }
    }
    const groupedItems = Array.from(groupedItemsMap.values());
    return groupedItems;
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

  async findEquippedItemByType(
    userCharacterId: number,
    equipmentType: ItemEquipmentTypeEnum
  ): Promise<UserCharacterItem | null> {
    return await prisma.userCharacterItem.findFirst({
      where: {
        userCharacterId,
        equipped: true,
        item: {
          equipmentType,
        },
      },
    });
  }
}
