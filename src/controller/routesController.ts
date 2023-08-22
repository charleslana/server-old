import { FastifyInstance } from 'fastify';
import { validateBodyMiddleware } from '../middleware/middleware';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  fastify.post(
    '/data',
    { preHandler: [validateBodyMiddleware] },
    async (request, _reply) => {
      return { message: 'Data received successfully', data: request.body };
    }
  );

  fastify.get('/data', async (_request, _reply) => {
    return { message: 'Data fetched successfully', data: {} };
  });

  done();
}

export default function routesController(
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) {
  fastify.register(createRoute, { prefix: '/v1' });

  done();
}
