import { FastifyInstance, FastifyRequest } from 'fastify';
import { UserCharacterSkillService } from '../service/UserCharacterSkillService';
import { validateAuthMiddleware } from '../middleware/authMiddleware';
import { validateCelebrateMiddleware } from '../middleware/celebrate/validateCelebrateMiddleware';
import { validateId } from '../middleware/celebrate/commonCelebrate';
import { validateSessionMiddleware } from '../middleware/sessionMiddleware';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  const userCharacterSkillService = new UserCharacterSkillService();

  fastify.get(
    '/',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async (request: FastifyRequest, _reply) => {
      const getAll = await userCharacterSkillService.getAllByUserCharacterId(
        request.session.userCharacterId!
      );
      return getAll;
    }
  );

  fastify.get(
    '/:id',
    {
      preHandler: [
        validateCelebrateMiddleware<{ Params: { id: number } }>(validateId()),
        validateAuthMiddleware(),
        validateSessionMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Params: { id: number } }>, _reply) => {
      const get = await userCharacterSkillService.getByIdAndUserCharacterId(
        request.params.id,
        request.session.userCharacterId!
      );
      return get;
    }
  );

  done();
}

export default function userCharacterSkillController(
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) {
  fastify.register(createRoute, { prefix: '/user/character/skill' });

  done();
}
