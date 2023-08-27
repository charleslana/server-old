import { CharacterService } from '../service/CharacterService';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { validateAuthMiddleware } from '../middleware/authMiddleware';
import { validateCelebrateMiddleware } from '../middleware/validateCelebrateMiddleware';
import { validateId } from '../middleware/celebrate/commonCelebrate';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  const characterService = new CharacterService();

  fastify.get(
    '/',
    {
      preHandler: [validateAuthMiddleware()],
    },
    async () => {
      const getAll = await characterService.getAll();
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
    async (request: FastifyRequest<{ Params: { id: number } }>) => {
      const get = await characterService.getById(request.params.id);
      return get;
    }
  );

  done();
}

export default function characterController(
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) {
  fastify.register(createRoute, { prefix: '/character' });

  done();
}
