import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { isCelebrateError } from 'celebrate';

export function validateCelebrateMiddleware<T extends RouteGenericInterface>(
  celebrateFn: (req: FastifyRequest<T>, rep: FastifyReply) => Promise<void>
) {
  return async (request: FastifyRequest<T>, reply: FastifyReply) => {
    try {
      await celebrateFn(request, reply);
    } catch (error) {
      if (isCelebrateError(error)) {
        reply.status(400).send({
          message: 'Validation error',
          errors: [...error.details.values()].map(detail => detail.message),
        });
      } else {
        reply.status(500).send({
          message: 'Validate internal server error',
        });
      }
    }
  };
}
