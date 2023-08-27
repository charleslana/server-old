import { FastifyInstance, FastifyRequest } from 'fastify';
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
      fastify.log.info('Criar usuário');
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
      fastify.log.warn('Obter todos usuários');
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
      fastify.log.warn(`Obter usuário pelo id ${request.params.id}`);
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
      fastify.log.info('Atualizar nome do usuário');
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
    async (request: FastifyRequest<{ Params: { id: number } }>) => {
      fastify.log.warn(`Excluir usuário ${request.params.id}`);
      await userService.delete(request.params.id);
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
      fastify.log.info('Realizar autenticação');
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
      fastify.log.info(`Obter perfil do usuário ${request.user.id}`);
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
    async (request: FastifyRequest<{ Body: IPassword }>) => {
      fastify.log.info('Atualizar senha do usuário');
      request.body.userId = request.user.id;
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
