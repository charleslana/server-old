import { FastifyInstance, FastifyRequest } from 'fastify';
import { RoleEnum, UserCharacterItem } from '@prisma/client';
import { UserCharacterItemService } from '../service/UserCharacterItemService';
import { UserCharacterService } from '../service/UserCharacterService';
import { validateAuthMiddleware } from '../middleware/authMiddleware';
import { validateBodyMiddleware } from '../middleware/validateBodyMiddleware';
import { validateCelebrateMiddleware } from '../middleware/validateCelebrateMiddleware';
import { validateCreateUserCharacterItem } from '../middleware/celebrate/userCharacterItemCelebrate';
import { validateId } from '../middleware/celebrate/commonCelebrate';
import { validateRoleMiddleware } from '../middleware/roleMiddleware';
import { validateSessionMiddleware } from '../middleware/sessionMiddleware';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  const userCharacterItemService = new UserCharacterItemService();
  const userCharacterService = new UserCharacterService();

  fastify.post(
    '/',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateCelebrateMiddleware<{ Body: UserCharacterItem }>(
          validateCreateUserCharacterItem()
        ),
        validateAuthMiddleware(),
        validateRoleMiddleware([RoleEnum.admin]),
      ],
    },
    async (request: FastifyRequest<{ Body: UserCharacterItem }>) => {
      fastify.log.warn(
        `Criar item para o personagem pelo id ${request.body.userCharacterId}`
      );
      await userCharacterService.getById(request.body.userCharacterId);
      const create = await userCharacterItemService.create(request.body);
      return create;
    }
  );

  fastify.get(
    '/',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async (request: FastifyRequest) => {
      fastify.log.info(
        `Obter todos os itens do personagem ${request.session.userCharacterId}`
      );
      const getAll = await userCharacterItemService.getAllByUserCharacterId(
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
    async (request: FastifyRequest<{ Params: { id: number } }>) => {
      fastify.log.info(
        `Obter item do personagem ${request.session.userCharacterId} pelo id ${request.params.id}`
      );
      const get = await userCharacterItemService.getByIdAndUserCharacterId(
        request.params.id,
        request.session.userCharacterId!
      );
      return get;
    }
  );

  fastify.delete(
    '/:id',
    {
      preHandler: [
        validateCelebrateMiddleware<{ Params: { id: number } }>(validateId()),
        validateAuthMiddleware(),
        validateSessionMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Params: { id: number } }>) => {
      fastify.log.info(
        `Excluir item do personagem ${request.session.userCharacterId} pelo id ${request.params.id}`
      );
      await userCharacterItemService.delete(
        request.params.id,
        request.session.userCharacterId!
      );
    }
  );

  done();
}

export default function userCharacterItemController(
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) {
  fastify.register(createRoute, { prefix: '/user/character/item' });

  done();
}
