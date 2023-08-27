import { container } from 'tsyringe';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { UserCharacterGroupService } from '../service/UserCharacterGroupService';
import { validateAuthMiddleware } from '../middleware/authMiddleware';
import { validateSessionMiddleware } from '../middleware/sessionMiddleware';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  const userCharacterGroupService = container.resolve(
    UserCharacterGroupService
  );

  fastify.get(
    '/',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async (request: FastifyRequest) => {
      const get = await userCharacterGroupService.getByIdAndUserCharacterId(
        request.session.userCharacterId!
      );
      return get;
    }
  );

  fastify.delete(
    '/',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async (request: FastifyRequest) => {
      await userCharacterGroupService.deleteByUserCharacterId(
        request.session.userCharacterId!
      );
    }
  );

  done();
}

export default function userCharacterGroupController(
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) {
  fastify.register(createRoute, { prefix: '/user/character/group' });

  done();
}
