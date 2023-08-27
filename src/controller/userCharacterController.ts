import { FastifyInstance, FastifyRequest } from 'fastify';
import { IAttribute } from '../interface/IAttribute';
import { UserCharacter } from '@prisma/client';
import { UserCharacterService } from '../service/UserCharacterService';
import { validateAuthMiddleware } from '../middleware/authMiddleware';
import { validateBodyMiddleware } from '../middleware/validateBodyMiddleware';
import { validateCelebrateMiddleware } from '../middleware/validateCelebrateMiddleware';
import { validateId } from '../middleware/celebrate/commonCelebrate';
import { validateSessionMiddleware } from '../middleware/sessionMiddleware';
import {
  validateCreateUserCharacter,
  validateUpdateAttribute,
} from '../middleware/celebrate/userCharacterCelebrate';

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
    async (request: FastifyRequest<{ Body: UserCharacter }>) => {
      fastify.log.info('Criar personagem');
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
    async (request: FastifyRequest) => {
      fastify.log.info(
        `Obter todos os personagens do usuário ${request.user.id}`
      );
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
    async (request: FastifyRequest<{ Params: { id: number } }>) => {
      fastify.log.info(`Obter personagem pelo id ${request.params.id}`);
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
    async (request: FastifyRequest<{ Params: { id: number } }>) => {
      fastify.log.info(
        `Excluir personagem do usuário ${request.user.id} pelo id ${request.params.id}`
      );
      await userCharacterService.delete(request.params.id, request.user.id);
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
    async (request: FastifyRequest<{ Params: { id: number } }>) => {
      fastify.log.info(
        `Selecionar personagem do usuário ${request.user.id} pelo id ${request.params.id}`
      );
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
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async (request: FastifyRequest) => {
      fastify.log.info(
        `Logout do personagem selecionado ${request.session.userCharacterId}`
      );
      request.session.userCharacterId = undefined;
    }
  );

  fastify.get(
    '/profile',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async (request: FastifyRequest) => {
      fastify.log.info(
        `Obter perfil do personagem do usuário ${request.user.id} pelo id ${request.session.userCharacterId}`
      );
      const get = await userCharacterService.getByIdAndUserId(
        request.session.userCharacterId!,
        request.user.id
      );
      return get;
    }
  );

  fastify.put(
    '/attribute',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateCelebrateMiddleware<{ Body: IAttribute }>(
          validateUpdateAttribute()
        ),
        validateAuthMiddleware(),
        validateSessionMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Body: IAttribute }>) => {
      fastify.log.info(
        `Atualizar atributo do personagem do usuário ${request.user.id} pelo id ${request.session.userCharacterId}`
      );
      request.body.userId = request.user.id;
      request.body.id = request.session.userCharacterId!;
      await userCharacterService.updateAttribute(request.body);
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
