import { PrismaClient, Skill } from '@prisma/client';

const prisma = new PrismaClient();

export class SkillRepository {
  async findById(id: number): Promise<Skill | null> {
    return await prisma.skill.findUnique({
      where: { id },
    });
  }
}
