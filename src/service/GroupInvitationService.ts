import { delay, inject, injectable } from 'tsyringe';
import { GlobalError } from '../handler/GlobalError';
import { GroupInvitationRepository } from '../repository/GroupInvitationRepository';
import { GroupService } from './GroupService';
import { UserCharacterGroupService } from './UserCharacterGroupService';
import {
  GroupInvitation,
  RoleGroupEnum,
  UserCharacterGroup,
} from '@prisma/client';

@injectable()
export class GroupInvitationService {
  constructor(
    @inject(GroupInvitationRepository)
    private repository: GroupInvitationRepository,
    @inject(delay(() => UserCharacterGroupService))
    private userCharacterGroupService: UserCharacterGroupService,
    @inject(delay(() => GroupService))
    private groupService: GroupService
  ) {}

  async create(groupInvitation: GroupInvitation): Promise<GroupInvitation> {
    await this.groupService.getById(groupInvitation.groupId);
    await this.userCharacterGroupService.validateUserCharacterInGroup(
      groupInvitation.userCharacterId
    );
    const find = await this.repository.existsByGroupIdAndUserCharacterId(
      groupInvitation.groupId,
      groupInvitation.userCharacterId
    );
    if (find) {
      throw new GlobalError('Já existe um convite para este grupo');
    }
    return await this.repository.save(groupInvitation);
  }

  async getAllByUserCharacterId(
    userCharacterId: number
  ): Promise<GroupInvitation[]> {
    const find =
      await this.userCharacterGroupService.getByUserCharacterId(
        userCharacterId
      );
    const findAll = await this.repository.findAll(find.groupId);
    return findAll;
  }

  async delete(id: number, userCharacterId: number): Promise<void> {
    const find = await this.repository.findByIdAndUserCharacterId(
      id,
      userCharacterId
    );
    if (!find) {
      throw new GlobalError('Convite de grupo não encontrado');
    }
    await this.repository.delete(find.id);
  }

  async handleInvitation(
    id: number,
    accept: boolean,
    userCharacterId: number
  ): Promise<void> {
    const find = await this.repository.find(id);
    if (!find) {
      throw new GlobalError('Convite de grupo não encontrado');
    }
    const userCharacter =
      await this.groupService.validateCharacterHasGroup(userCharacterId);
    this.groupService.validateRoleGroup(
      [RoleGroupEnum.leader, RoleGroupEnum.master],
      userCharacter.groupMember!.role
    );
    await this.userCharacterGroupService.validateUserCharacterInGroup(
      find.userCharacterId
    );
    const userCharacterGroup = {} as UserCharacterGroup;
    userCharacterGroup.userCharacterId = find.userCharacterId;
    userCharacterGroup.groupId = find.groupId;
    if (accept) {
      await this.userCharacterGroupService.create(userCharacterGroup);
    }
    await this.repository.delete(id);
  }
}
