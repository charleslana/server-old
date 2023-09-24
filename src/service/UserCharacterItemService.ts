import { GlobalError } from '../handler/GlobalError';
import { IGroupedItem } from '../interface/IGroupedItem';
import { ItemService } from './ItemService';
import { UserCharacterItem } from '@prisma/client';
import { UserCharacterItemRepository } from '../repository/UserCharacterItemRepository';

export class UserCharacterItemService {
  private repository = new UserCharacterItemRepository();
  private itemService = new ItemService();

  async create(
    userCharacterItem: UserCharacterItem
  ): Promise<UserCharacterItem> {
    await this.itemService.getById(userCharacterItem.itemId);
    return await this.repository.save(userCharacterItem);
  }

  async getByIdAndUserCharacterId(
    id: number,
    userCharacterId: number
  ): Promise<IGroupedItem> {
    const find = (await this.repository.findByIdAndUserCharacterId(
      id,
      userCharacterId
    )) as IGroupedItem;
    if (!find) {
      throw new GlobalError('Item do personagem não encontrado');
    }
    return find;
  }

  async getAllByUserCharacterId(
    userCharacterId: number
  ): Promise<IGroupedItem[]> {
    const findAll =
      await this.repository.findAllUserCharacterId(userCharacterId);
    return findAll;
  }

  async delete(id: number, userCharacterId: number): Promise<void> {
    await this.getByIdAndUserCharacterId(id, userCharacterId);
    await this.repository.delete(id);
  }

  async equip(
    id: number,
    userCharacterId: number,
    equipped: boolean
  ): Promise<UserCharacterItem | null> {
    const userCharacterItem = await this.getByIdAndUserCharacterId(
      id,
      userCharacterId
    );
    if (userCharacterItem.item.type != 'equipment') {
      throw new GlobalError('O item não pode ser equipado');
    }
    if (equipped && userCharacterItem.item.equipmentType) {
      const existingEquippedItem = await this.repository.findEquippedItemByType(
        userCharacterId,
        userCharacterItem.item.equipmentType
      );
      if (existingEquippedItem) {
        await this.repository.update(existingEquippedItem.id, {
          equipped: false,
        });
      }
    }
    return await this.repository.update(id, {
      equipped,
    });
  }
}
