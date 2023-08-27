import { GlobalError } from '../handler/GlobalError';
import { GroupService } from './GroupService';
import { UserCharacterGroup } from '@prisma/client';
import { UserCharacterGroupRepository } from '../repository/UserCharacterGroupRepository';

export class UserCharacterGroupService {
  private userCharacterGroupRepository = new UserCharacterGroupRepository();
  private groupService = new GroupService();

  async create(
    userCharacterGroup: UserCharacterGroup
  ): Promise<UserCharacterGroup> {
    await this.groupService.getById(userCharacterGroup.groupId);
    return await this.userCharacterGroupRepository.save(userCharacterGroup);
  }

  async getByIdAndUserCharacterId(
    userCharacterId: number
  ): Promise<UserCharacterGroup> {
    const find =
      await this.userCharacterGroupRepository.findByUserCharacterId(
        userCharacterId
      );
    if (!find) {
      throw new GlobalError('Grupo do personagem não encontrado');
    }
    return find;
  }

  async deleteByUserCharacterId(userCharacterId: number): Promise<void> {
    await this.getByIdAndUserCharacterId(userCharacterId);
    await this.userCharacterGroupRepository.deleteByUserCharacterId(
      userCharacterId
    );
  }
}
