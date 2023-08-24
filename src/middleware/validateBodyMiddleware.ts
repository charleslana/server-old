import { FastifyRequest, FastifyReply, RouteGenericInterface } from 'fastify';

export function validateBodyMiddleware<T extends RouteGenericInterface>() {
  return (
    request: FastifyRequest<T>,
    reply: FastifyReply,
    doneHook: () => void
  ) => {
    if (!request.body || Object.keys(request.body).length === 0) {
      reply.status(400).send({
        message: 'Bad Request: Request body is missing or empty',
      });
    } else {
      doneHook();
    }
  };
}
