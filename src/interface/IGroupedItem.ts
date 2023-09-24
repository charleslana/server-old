import { Item, UserCharacterItem } from '@prisma/client';

export interface IGroupedItem extends UserCharacterItem {
  quantity: number;
  item: Item;
}
