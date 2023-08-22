import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export class UserRepository {
  async save(user: User): Promise<User> {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    return await prisma.user.create({
      data: {
        ...user,
        password: hashedPassword,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id },
    });
  }
}
