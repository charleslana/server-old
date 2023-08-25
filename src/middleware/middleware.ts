import { FastifyRequest, FastifyReply } from 'fastify';

export const validateBodyMiddleware = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  if (!request.body) {
    reply.code(400).send({ error: 'No body' });
  }
  if (Object.keys(request.body as Record<string, unknown>).length === 0) {
    reply.code(400).send({ error: 'Empty request body' });
  }
};
