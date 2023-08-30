import { Character, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CharacterRepository {
  async findAll(): Promise<Character[]> {
    return await prisma.character.findMany();
  }

  async findById(id: number): Promise<Character | null> {
    return await prisma.character.findUnique({
      where: { id },
    });
  }
}
