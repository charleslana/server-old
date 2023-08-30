import { GroupInvitation, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class GroupInvitationRepository {
  async save(groupInvitation: GroupInvitation): Promise<GroupInvitation> {
    return await prisma.groupInvitation.create({
      data: groupInvitation,
    });
  }

  async findByIdAndUserCharacterId(
    id: number,
    userCharacterId: number
  ): Promise<GroupInvitation | null> {
    return await prisma.groupInvitation.findUnique({
      where: { id, userCharacterId },
    });
  }

  async find(id: number): Promise<GroupInvitation | null> {
    return await prisma.groupInvitation.findUnique({
      where: { id },
    });
  }

  async findAll(groupId: number): Promise<GroupInvitation[]> {
    return await prisma.groupInvitation.findMany({
      where: { groupId },
      include: {
        userCharacter: {
          select: {
            name: true,
            level: true,
          },
        },
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await prisma.groupInvitation.delete({
      where: { id },
    });
    return !!deleted;
  }

  async existsByGroupIdAndUserCharacterId(
    groupId: number,
    userCharacterId: number
  ): Promise<boolean> {
    const invitation = await prisma.groupInvitation.findFirst({
      where: { groupId, userCharacterId },
    });
    return !!invitation;
  }
}
