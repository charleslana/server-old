import { FastifyInstance } from 'fastify';
import { UserService } from '../service/UserService';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  const userService = new UserService();

  fastify.get('/', async (_request, _reply) => {
    const getAll = await userService.getAll();
    return { message: 'Data fetched successfully', data: getAll };
  });

  done();
}

export default function userController(
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) {
  fastify.register(createRoute, { prefix: '/user' });

  done();
}
