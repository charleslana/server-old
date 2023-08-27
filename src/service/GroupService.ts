import { GlobalError } from '../handler/GlobalError';
import { Group } from '@prisma/client';
import { GroupRepository } from '../repository/GroupRepository';
import { IGroup } from '../interface/IGroup';
import { UserCharacterService } from './UserCharacterService';

export class GroupService {
  private groupRepository = new GroupRepository();
  private userCharacterService = new UserCharacterService();

  async create(group: IGroup): Promise<Group> {
    await this.userCharacterService.getById(
      group.UserCharacterGroup.userCharacterId
    );
    await this.checkIfGroupNameExists(group.name);
    return await this.groupRepository.save(group);
  }

  async getById(id: number): Promise<Group> {
    const find = await this.groupRepository.findById(id);
    if (!find) {
      throw new GlobalError('Grupo não encontrado');
    }
    return find;
  }

  async getAll(): Promise<Group[]> {
    const findAll = await this.groupRepository.findAll();
    return findAll;
  }

  async updateName(group: IGroup): Promise<Group | null> {
    await this.getById(group.id);
    await this.checkIfGroupNameExists(group.name, group.id);
    return await this.groupRepository.update(group.id, {
      name: group.name,
    });
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.groupRepository.delete(id);
  }

  private async checkIfGroupNameExists(
    name: string,
    groupId?: number
  ): Promise<void> {
    const exist = await this.groupRepository.existsByName(name, groupId);
    if (exist) {
      throw new GlobalError('Nome de grupo já cadastrado');
    }
  }
}
