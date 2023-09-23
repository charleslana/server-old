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
  ): Promise<UserCharacterItem> {
    const find = await this.repository.findByIdAndUserCharacterId(
      id,
      userCharacterId
    );
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
}
