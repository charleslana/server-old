import { delay, inject, injectable } from 'tsyringe';
import { formatNumber } from '../utils/utils';
import { GlobalError } from '../handler/GlobalError';
import { Group, UserCharacter } from '@prisma/client';
import { GroupRepository } from '../repository/GroupRepository';
import { IGroup } from '../interface/IGroup';
import { IRequirementGroup } from '../interface/IRequirementGroup';
import { UserCharacterGroupService } from './UserCharacterGroupService';
import { UserCharacterService } from './UserCharacterService';

@injectable()
export class GroupService {
  constructor(
    @inject(GroupRepository)
    private repository: GroupRepository,
    @inject(delay(() => UserCharacterGroupService))
    private userCharacterGroupService: UserCharacterGroupService,
    @inject(UserCharacterService)
    private userCharacterService: UserCharacterService
  ) {}

  async create(group: IGroup): Promise<Group> {
    const userCharacter = await this.userCharacterService.getById(
      group.UserCharacterGroup.userCharacterId
    );
    await this.userCharacterGroupService.validateUserCharacterInGroup(
      group.UserCharacterGroup.userCharacterId
    );
    this.validateGroupRequirements(userCharacter);
    await this.checkIfGroupNameExists(group.name);
    const getGroupRequirements = this.getGroupRequirements();
    userCharacter.gold = userCharacter.gold - getGroupRequirements.gold;
    await this.userCharacterService.updateGold(userCharacter);
    return await this.repository.save(group);
  }

  async getById(id: number): Promise<Group> {
    const find = await this.repository.findById(id);
    if (!find) {
      throw new GlobalError('Grupo não encontrado');
    }
    return find;
  }

  async getAll(): Promise<Group[]> {
    const findAll = await this.repository.findAll();
    return findAll;
  }

  async updateName(group: IGroup): Promise<Group | null> {
    await this.getById(group.id);
    await this.checkIfGroupNameExists(group.name, group.id);
    return await this.repository.update(group.id, {
      name: group.name,
    });
  }

  async delete(id: number): Promise<void> {
    await this.getById(id);
    await this.repository.delete(id);
  }

  getGroupRequirements(): IRequirementGroup {
    const requirementGroup = {} as IRequirementGroup;
    requirementGroup.level = 30;
    requirementGroup.gold = 50000;
    return requirementGroup;
  }

  private validateGroupRequirements(userCharacter: UserCharacter): void {
    const getGroupRequirements = this.getGroupRequirements();
    if (userCharacter.level < getGroupRequirements.level) {
      throw new GlobalError(
        `Nível de personagem insuficiente, requer nível ${getGroupRequirements.level}`
      );
    }
    if (userCharacter.gold < getGroupRequirements.gold) {
      throw new GlobalError(
        `Ouro insuficiente, requer ${formatNumber(
          getGroupRequirements.gold
        )} ouro`
      );
    }
  }

  private async checkIfGroupNameExists(
    name: string,
    groupId?: number
  ): Promise<void> {
    const exist = await this.repository.existsByName(name, groupId);
    if (exist) {
      throw new GlobalError('Nome de grupo já cadastrado');
    }
  }
}
