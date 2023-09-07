import { Message, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class MessageRepository {
  async save(message: Message): Promise<Message> {
    return await prisma.message.create({
      data: {
        ...message,
      },
    });
  }

  async findAllUserCharacterId(userCharacterId: number): Promise<Message[]> {
    return await prisma.message.findMany({
      where: {
        receiverCharacterId: userCharacterId,
      },
      include: {
        items: true,
      },
    });
  }

  async findByIdAndUserCharacterId(
    id: number,
    userCharacterId: number
  ): Promise<Message | null> {
    return await prisma.message.findUnique({
      where: { id, receiverCharacterId: userCharacterId },
      include: {
        items: true,
      },
    });
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await prisma.message.delete({
      where: { id },
    });
    return !!deleted;
  }
}
