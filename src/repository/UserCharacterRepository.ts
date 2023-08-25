import { IUserCharacter } from '../interface/IUserCharacter';
import { PrismaClient, UserCharacter } from '@prisma/client';

const prisma = new PrismaClient();

export class UserCharacterRepository {
  async save(userCharacter: UserCharacter): Promise<UserCharacter> {
    return await prisma.userCharacter.create({
      data: {
        ...userCharacter,
      },
    });
  }

  async update(
    id: number,
    data: Partial<UserCharacter>
  ): Promise<UserCharacter | null> {
    return await prisma.userCharacter.update({
      where: { id },
      data,
    });
  }

  async findAllUserId(userId: number): Promise<IUserCharacter[]> {
    return await prisma.userCharacter.findMany({
      where: { userId },
      include: {
        character: true,
      },
    });
  }

  async findById(id: number): Promise<IUserCharacter | null> {
    return await prisma.userCharacter.findUnique({
      where: { id },
      include: {
        character: true,
      },
    });
  }

  async findByIdAndUserId(
    id: number,
    userId: number
  ): Promise<IUserCharacter | null> {
    return await prisma.userCharacter.findUnique({
      where: { id, userId },
      include: {
        character: true,
      },
    });
  }

  async existsByName(name: string, id: number | null = null): Promise<boolean> {
    const userCharacterWithSameName = await prisma.userCharacter.findFirst({
      where: {
        name,
        NOT: {
          id: id || undefined,
        },
      },
    });
    return userCharacterWithSameName !== null;
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await prisma.userCharacter.delete({
      where: { id },
    });
    return !!deleted;
  }
}
