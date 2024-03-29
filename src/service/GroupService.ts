import { delay, inject, injectable } from 'tsyringe';
import { formatNumber, getGroupImage } from '../utils/utils';
import { GlobalError } from '../handler/GlobalError';
import { Group, RoleGroupEnum, UserCharacter } from '@prisma/client';
import { GroupRepository } from '../repository/GroupRepository';
import { IGroup } from '../interface/IGroup';
import { IRequirementGroup } from '../interface/IRequirementGroup';
import { IUserCharacter } from '../interface/IUserCharacter';
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
      group.userCharacterGroup.userCharacterId
    );
    await this.userCharacterGroupService.validateUserCharacterInGroup(
      group.userCharacterGroup.userCharacterId
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
    if (find.image) {
      find.image = getGroupImage(find.image);
    }
    return find;
  }

  async getAll(): Promise<Group[]> {
    const findAll = await this.repository.findAll();
    for (const find of findAll) {
      if (find.image) {
        find.image = getGroupImage(find.image);
      }
    }
    return findAll;
  }

  async updateName(
    userCharacterId: number,
    name: string
  ): Promise<Group | null> {
    const userCharacter = await this.validateCharacterHasGroup(userCharacterId);
    this.validateRoleGroup(
      [RoleGroupEnum.leader],
      userCharacter.groupMember!.role
    );
    await this.checkIfGroupNameExists(name, userCharacter.groupMember!.groupId);
    return await this.repository.update(userCharacter.groupMember!.groupId, {
      name: name,
    });
  }

  async delete(userCharacterId: number): Promise<void> {
    const userCharacter = await this.validateCharacterHasGroup(userCharacterId);
    this.validateRoleGroup(
      [RoleGroupEnum.leader],
      userCharacter.groupMember!.role
    );
    await this.repository.delete(userCharacter.groupMember!.groupId);
  }

  async getByUserCharacterId(userCharacterId: number): Promise<Group> {
    const userCharacter = await this.validateCharacterHasGroup(userCharacterId);
    return await this.getById(userCharacter.groupMember!.groupId);
  }

  async updateImage(
    userCharacterId: number,
    fileName: string
  ): Promise<Group | null> {
    const userCharacter = await this.validateCharacterHasGroup(userCharacterId);
    this.validateRoleGroup(
      [RoleGroupEnum.leader],
      userCharacter.groupMember!.role
    );
    return await this.repository.update(userCharacter.groupMember!.groupId, {
      image: fileName,
    });
  }

  getGroupRequirements(): IRequirementGroup {
    const requirementGroup = {} as IRequirementGroup;
    requirementGroup.level = 30;
    requirementGroup.gold = 50000;
    return requirementGroup;
  }

  async validateCharacterHasGroup(
    userCharacterId: number
  ): Promise<IUserCharacter> {
    const userCharacter =
      await this.userCharacterService.getById(userCharacterId);
    if (!userCharacter.groupMember) {
      throw new GlobalError('Personagem não participa de grupo');
    }
    return userCharacter;
  }

  validateRoleGroup(allowedRoles: RoleGroupEnum[], role: RoleGroupEnum): void {
    if (!allowedRoles.includes(role)) {
      throw new GlobalError('Personagem não autorizado', 403);
    }
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
