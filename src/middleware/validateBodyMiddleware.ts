import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';

export function validateBodyMiddleware<T extends RouteGenericInterface>() {
  return (
    request: FastifyRequest<T>,
    reply: FastifyReply,
    doneHook: () => void
  ) => {
    if (!request.body || Object.keys(request.body).length === 0) {
      return reply.status(400).send({
        message: 'Bad Request: Request body is missing or empty',
      });
    }
    if (typeof request.body !== 'object' || Array.isArray(request.body)) {
      return reply.status(400).send({
        message: 'Requisição inválida. O corpo deve ser um objeto JSON.',
      });
    }
    doneHook();
  };
}
