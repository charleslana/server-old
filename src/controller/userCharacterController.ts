import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UserCharacter } from '@prisma/client';
import { UserCharacterService } from '../service/UserCharacterService';
import { validateAuthMiddleware } from '../middleware/authMiddleware';
import { validateBodyMiddleware } from '../middleware/validateBodyMiddleware';
import { validateCelebrateMiddleware } from '../middleware/celebrate/validateCelebrateMiddleware';
import { validateCreateUserCharacter } from '../middleware/celebrate/userCharacterMiddleware';
import { validateId } from '../middleware/celebrate/commonCelebrate';
import { validateSessionMiddleware } from '../middleware/sessionMiddleware';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  const userCharacterService = new UserCharacterService();

  fastify.post(
    '/',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateCelebrateMiddleware<{ Body: UserCharacter }>(
          validateCreateUserCharacter()
        ),
        validateAuthMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Body: UserCharacter }>, _reply) => {
      request.body.userId = request.user.id;
      const create = await userCharacterService.create(request.body);
      return create;
    }
  );

  fastify.get(
    '/',
    {
      preHandler: [validateAuthMiddleware()],
    },
    async (request: FastifyRequest, _reply) => {
      const getAll = await userCharacterService.getAllByUserId(request.user.id);
      return getAll;
    }
  );

  fastify.get(
    '/:id',
    {
      preHandler: [
        validateCelebrateMiddleware<{ Params: { id: number } }>(validateId()),
        validateAuthMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Params: { id: number } }>, _reply) => {
      const get = await userCharacterService.getById(request.params.id);
      return get;
    }
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [
        validateCelebrateMiddleware<{ Params: { id: number } }>(validateId()),
        validateAuthMiddleware(),
      ],
    },
    async (
      request: FastifyRequest<{ Params: { id: number } }>,
      reply: FastifyReply
    ) => {
      await userCharacterService.delete(request.params.id, reply);
    }
  );

  fastify.get(
    '/select/:id',
    {
      preHandler: [
        validateCelebrateMiddleware<{ Params: { id: number } }>(validateId()),
        validateAuthMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Params: { id: number } }>, _reply) => {
      const get = await userCharacterService.getByIdAndUserId(
        request.params.id,
        request.user.id
      );
      request.session.userCharacterId = get.id;
    }
  );

  fastify.get(
    '/logout',
    {
      preHandler: [validateAuthMiddleware()],
    },
    async (request: FastifyRequest, _reply) => {
      request.session.userCharacterId = undefined;
    }
  );

  fastify.get(
    '/profile',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async (request: FastifyRequest, _reply) => {
      const get = await userCharacterService.getByIdAndUserId(
        request.session.userCharacterId!,
        request.user.id
      );
      return get;
    }
  );

  done();
}

export default function userCharacterController(
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) {
  fastify.register(createRoute, { prefix: '/user/character' });

  done();
}
