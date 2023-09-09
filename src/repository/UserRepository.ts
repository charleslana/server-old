import { IUser } from '../interface/IUser';
import { PrismaClient, User } from '@prisma/client';

const prisma = new PrismaClient();

export class UserRepository {
  async save(user: User): Promise<User> {
    return await prisma.user.create({
      data: {
        ...user,
        roles: {
          create: {
            name: 'user',
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

  async findByEmail(email: string): Promise<IUser | null> {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        roles: true,
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await prisma.user.delete({
      where: { id },
    });
    return !!deleted;
  }
}
