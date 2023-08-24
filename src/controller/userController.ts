import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { User } from '@prisma/client';
import { UserService } from '../service/UserService';
import { validateBodyMiddleware } from '../middleware/validateBodyMiddleware';
import { validateId } from '../middleware/celebrate/commonCelebrate';
import { validateMiddleware } from '../middleware/validateMiddleware';
import {
  validateCreateUser,
  validateUpdateUserName,
} from '../middleware/celebrate/userMiddleware';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  const userService = new UserService();

  fastify.post(
    '/',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateMiddleware<{ Body: User }>(validateCreateUser()),
      ],
    },
    async (request: FastifyRequest<{ Body: User }>, _reply) => {
      await userService.create(request.body);
      return { message: 'Data created successfully', data: request.body };
    }
  );

  fastify.get('/', async (_request, _reply) => {
    const getAll = await userService.getAll();
    return { message: 'Data fetched successfully', data: getAll };
  });

  fastify.get(
    '/:id',
    {
      preHandler: [
        validateMiddleware<{ Params: { id: number } }>(validateId()),
      ],
    },
    async (request: FastifyRequest<{ Params: { id: number } }>, _reply) => {
      const get = await userService.getById(request.params.id);
      return { message: 'Data fetched successfully', data: get };
    }
  );

  fastify.put(
    '/',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateMiddleware<{ Body: User }>(validateUpdateUserName()),
      ],
    },
    async (request: FastifyRequest<{ Body: User }>, _reply) => {
      await userService.updateName(request.body);
      return { message: 'Data updated successfully', data: request.body };
    }
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [
        validateMiddleware<{ Params: { id: number } }>(validateId()),
      ],
    },
    async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) => {
      await userService.delete(request.params.id, reply);
      // return { message: 'Data deleted successfully' };
    }
  );

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
