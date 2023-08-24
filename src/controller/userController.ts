import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { RoleEnum, User } from '@prisma/client';
import { UserService } from '../service/UserService';
import { validateAuthMiddleware } from '../middleware/authMiddleware';
import { validateBodyMiddleware } from '../middleware/validateBodyMiddleware';
import { validateCelebrateMiddleware } from '../middleware/celebrate/validateCelebrateMiddleware';
import { validateId } from '../middleware/celebrate/commonCelebrate';
import { validateRoleMiddleware } from '../middleware/roleMiddleware';
import {
  validateCreateUser,
  validateLogin,
  validateUpdateUserName,
} from '../middleware/celebrate/userMiddleware';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  const userService = new UserService();

  fastify.post(
    '/',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateCelebrateMiddleware<{ Body: User }>(validateCreateUser()),
      ],
    },
    async (request: FastifyRequest<{ Body: User }>, _reply) => {
      await userService.create(request.body);
      return { message: 'Data created successfully', data: request.body };
    }
  );

  fastify.get(
    '/',
    {
      preHandler: [
        validateAuthMiddleware(),
        validateRoleMiddleware([RoleEnum.Admin]),
      ],
    },
    async (_request, _reply) => {
      const getAll = await userService.getAll();
      return { message: 'Data fetched successfully', data: getAll };
    }
  );

  fastify.get(
    '/:id',
    {
      preHandler: [
        validateCelebrateMiddleware<{ Params: { id: number } }>(validateId()),
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
        validateCelebrateMiddleware<{ Body: User }>(validateUpdateUserName()),
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
        validateCelebrateMiddleware<{ Params: { id: number } }>(validateId()),
      ],
    },
    async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) => {
      await userService.delete(request.params.id, reply);
    }
  );

  fastify.post(
    '/auth',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateCelebrateMiddleware<{
          Body: { email: string; password: string };
        }>(validateLogin()),
      ],
    },
    async (
      request: FastifyRequest<{ Body: { email: string; password: string } }>,
      _reply
    ) => {
      const token = await userService.authenticateAndGenerateToken(
        request.body.email,
        request.body.password
      );
      return { token };
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
