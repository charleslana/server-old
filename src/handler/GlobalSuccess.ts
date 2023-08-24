import { FastifyReply } from 'fastify';

export class GlobalSuccess {
  static send(reply: FastifyReply, message: string, data?: unknown): void {
    reply.code(200).send({ message, data });
  }
}
