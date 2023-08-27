import { PrismaClient, UserCharacterGroup } from '@prisma/client';

const prisma = new PrismaClient();

export class UserCharacterGroupRepository {
  async save(
    userCharacterGroup: UserCharacterGroup
  ): Promise<UserCharacterGroup> {
    return await prisma.userCharacterGroup.create({
      data: {
        ...userCharacterGroup,
      },
    });
  }

  async update(
    userCharacterId: number,
    data: Partial<UserCharacterGroup>
  ): Promise<UserCharacterGroup | null> {
    return await prisma.userCharacterGroup.update({
      where: { userCharacterId },
      data,
    });
  }

  async findByUserCharacterId(
    userCharacterId: number
  ): Promise<UserCharacterGroup | null> {
    return await prisma.userCharacterGroup.findUnique({
      where: { userCharacterId },
      include: {
        group: true,
      },
    });
  }

  async deleteByUserCharacterId(userCharacterId: number): Promise<boolean> {
    const deleted = await prisma.userCharacterGroup.delete({
      where: { userCharacterId },
    });
    return !!deleted;
  }

  async isUserCharacterInGroup(userCharacterId: number): Promise<boolean> {
    const find = await prisma.userCharacterGroup.findUnique({
      where: { userCharacterId },
    });

    return !!find;
  }
}
