import { FastifyReply } from 'fastify';
import { GlobalError } from '../handler/GlobalError';
import { GlobalSuccess } from '../handler/GlobalSuccess';
import { ItemService } from './ItemService';
import { UserCharacterItem } from '@prisma/client';
import { UserCharacterItemRepository } from '../repository/UserCharacterItemRepository';

export class UserCharacterItemService {
  private userCharacterItemRepository = new UserCharacterItemRepository();
  private itemService = new ItemService();

  async create(
    userCharacterItem: UserCharacterItem
  ): Promise<UserCharacterItem> {
    await this.itemService.getById(userCharacterItem.itemId);
    return await this.userCharacterItemRepository.save(userCharacterItem);
  }

  async getByIdAndUserCharacterId(
    id: number,
    userCharacterId: number
  ): Promise<UserCharacterItem> {
    const find =
      await this.userCharacterItemRepository.findByIdAndUserCharacterId(
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
  ): Promise<UserCharacterItem[]> {
    const findAll =
      await this.userCharacterItemRepository.findAllUserCharacterId(
        userCharacterId
      );
    return findAll;
  }

  async delete(
    id: number,
    userCharacterId: number,
    reply: FastifyReply
  ): Promise<void> {
    await this.getByIdAndUserCharacterId(id, userCharacterId);
    await this.userCharacterItemRepository.delete(id);
    GlobalSuccess.send(reply, 'Item do personagem excluído com sucesso');
  }
}
