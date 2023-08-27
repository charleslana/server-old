import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { IPassword } from '../interface/IPassword';
import { RoleEnum, User } from '@prisma/client';
import { UserService } from '../service/UserService';
import { validateAuthMiddleware } from '../middleware/authMiddleware';
import { validateBodyMiddleware } from '../middleware/validateBodyMiddleware';
import { validateCelebrateMiddleware } from '../middleware/validateCelebrateMiddleware';
import { validateId } from '../middleware/celebrate/commonCelebrate';
import { validateRoleMiddleware } from '../middleware/roleMiddleware';
import {
  validateCreateUser,
  validateLogin,
  validatePassword,
  validateUpdateUserName,
} from '../middleware/celebrate/userCelebrate';

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
    async (request: FastifyRequest<{ Body: User }>) => {
      const create = await userService.create(request.body);
      return create;
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
    async () => {
      const getAll = await userService.getAll();
      return getAll;
    }
  );

  fastify.get(
    '/:id',
    {
      preHandler: [
        validateCelebrateMiddleware<{ Params: { id: number } }>(validateId()),
        validateAuthMiddleware(),
        validateRoleMiddleware([RoleEnum.Admin]),
      ],
    },
    async (request: FastifyRequest<{ Params: { id: number } }>) => {
      const get = await userService.getById(request.params.id);
      return get;
    }
  );

  fastify.put(
    '/name',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateCelebrateMiddleware<{ Body: User }>(validateUpdateUserName()),
        validateAuthMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Body: User }>) => {
      request.body.id = request.user.id;
      const update = await userService.updateName(request.body);
      return update;
    }
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [
        validateCelebrateMiddleware<{ Params: { id: number } }>(validateId()),
        validateAuthMiddleware(),
        validateRoleMiddleware([RoleEnum.Admin]),
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
      request: FastifyRequest<{ Body: { email: string; password: string } }>
    ) => {
      const token = await userService.authenticateAndGenerateToken(
        request.body.email,
        request.body.password
      );
      return { token };
    }
  );

  fastify.get(
    '/profile',
    {
      preHandler: [validateAuthMiddleware()],
    },
    async (request: FastifyRequest) => {
      const get = await userService.getById(request.user.id);
      return get;
    }
  );

  fastify.put(
    '/password',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateCelebrateMiddleware<{ Body: IPassword }>(validatePassword()),
        validateAuthMiddleware(),
      ],
    },
    async (
      request: FastifyRequest<{ Body: IPassword }>,
      reply: FastifyReply
    ) => {
      request.body.userId = request.user.id;
      request.body.reply = reply;
      await userService.updatePassword(request.body);
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
