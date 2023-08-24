import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async save(user: User): Promise<User> {
    return await prisma.user.create({
      data: {
        ...user,
        roles: {
          create: {
            name: 'User',
          },
        },
      },
    });
  }

  async update(id: number, data: Partial<User>): Promise<User | null> {
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async findAll(): Promise<User[]> {
    return await prisma.user.findMany({
      include: {
        roles: true,
      },
    });
  }

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
      include: {
        roles: true,
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
      },
    });
  }

  async existsByName(
    name: string,
    userId: number | null = null
  ): Promise<boolean> {
    const userWithSameName = await prisma.user.findFirst({
      where: {
        name,
        NOT: {
          id: userId || undefined,
        },
      },
    });
    return userWithSameName !== null;
  }

  async delete(id: number): Promise<boolean> {
    await prisma.role.deleteMany({
      where: { userId: id },
    });
    const deletedUser = await prisma.user.delete({
      where: { id },
    });
    return !!deletedUser;
  }
}
