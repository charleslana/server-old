import { delay, inject, injectable } from 'tsyringe';
import { GlobalError } from '../handler/GlobalError';
import { GroupService } from './GroupService';
import { UserCharacterGroup } from '@prisma/client';
import { UserCharacterGroupRepository } from '../repository/UserCharacterGroupRepository';

@injectable()
export class UserCharacterGroupService {
  constructor(
    @inject(UserCharacterGroupRepository)
    private repository: UserCharacterGroupRepository,
    @inject(delay(() => GroupService))
    private groupService: GroupService
  ) {}

  async create(
    userCharacterGroup: UserCharacterGroup
  ): Promise<UserCharacterGroup> {
    await this.groupService.getById(userCharacterGroup.groupId);
    return await this.repository.save(userCharacterGroup);
  }

  async getByUserCharacterId(
    userCharacterId: number
  ): Promise<UserCharacterGroup> {
    const find = await this.repository.findByUserCharacterId(userCharacterId);
    if (!find) {
      throw new GlobalError('Grupo do personagem não encontrado');
    }
    return find;
  }

  async deleteByUserCharacterId(userCharacterId: number): Promise<void> {
    await this.getByUserCharacterId(userCharacterId);
    await this.repository.deleteByUserCharacterId(userCharacterId);
  }

  async validateUserCharacterInGroup(userCharacterId: number): Promise<void> {
    const get = await this.repository.isUserCharacterInGroup(userCharacterId);
    if (get) {
      throw new GlobalError('Personagem já está em um grupo');
    }
  }
}
