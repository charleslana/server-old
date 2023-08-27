import { Group, PrismaClient, RoleGroupEnum } from '@prisma/client';
import { IGroup } from '../interface/IGroup';

const prisma = new PrismaClient();

export class GroupRepository {
  async save(group: IGroup): Promise<Group> {
    return await prisma.group.create({
      data: {
        ...group,
        UserCharacterGroup: {
          create: {
            userCharacterId: group.UserCharacterGroup.userCharacterId,
            role: RoleGroupEnum.Leader,
          },
        },
      },
    });
  }

  async update(id: number, data: Partial<Group>): Promise<Group | null> {
    return await prisma.group.update({
      where: { id },
      data,
    });
  }

  async findAll(): Promise<Group[]> {
    return await prisma.group.findMany({
      include: {
        UserCharacterGroup: true,
      },
    });
  }

  async findById(id: number): Promise<Group | null> {
    return await prisma.group.findUnique({
      where: { id },
      include: {
        UserCharacterGroup: true,
      },
    });
  }

  async existsByName(
    name: string,
    groupId: number | null = null
  ): Promise<boolean> {
    const groupWithSameName = await prisma.group.findFirst({
      where: {
        name,
        NOT: {
          id: groupId || undefined,
        },
      },
    });
    return groupWithSameName !== null;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await prisma.group.delete({
      where: { id },
    });
    return !!deleted;
  }
}
