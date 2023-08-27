import { FastifyReply } from 'fastify';
import { GlobalError } from '../handler/GlobalError';
import { GlobalSuccess } from '../handler/GlobalSuccess';
import { Group } from '@prisma/client';
import { GroupRepository } from '../repository/GroupRepository';
import { IGroup } from '../interface/IGroup';

export class GroupService {
  private groupRepository = new GroupRepository();

  async create(group: IGroup): Promise<Group> {
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

  async delete(id: number, reply: FastifyReply): Promise<void> {
    await this.getById(id);
    await this.groupRepository.delete(id);
    GlobalSuccess.send(reply, 'Grupo excluído com sucesso');
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
