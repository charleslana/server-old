import { PrismaClient, UserCharacterSkill } from '@prisma/client';

const prisma = new PrismaClient();

export class UserCharacterSkillRepository {
  async save(
    userCharacterSkill: UserCharacterSkill
  ): Promise<UserCharacterSkill> {
    return await prisma.userCharacterSkill.create({
      data: {
        ...userCharacterSkill,
      },
    });
  }

  async update(
    id: number,
    data: Partial<UserCharacterSkill>
  ): Promise<UserCharacterSkill | null> {
    return await prisma.userCharacterSkill.update({
      where: { id },
      data,
    });
  }

  async findAllUserCharacterId(
    userCharacterId: number
  ): Promise<UserCharacterSkill[]> {
    return await prisma.userCharacterSkill.findMany({
      where: { userCharacterId },
      include: {
        skill: true,
      },
    });
  }

  async findByIdAndUserCharacterId(
    id: number,
    userCharacterId: number
  ): Promise<UserCharacterSkill | null> {
    return await prisma.userCharacterSkill.findUnique({
      where: { id, userCharacterId },
      include: {
        skill: true,
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await prisma.userCharacterSkill.delete({
      where: { id },
    });
    return !!deleted;
  }
}
