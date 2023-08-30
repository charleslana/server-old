import { container } from 'tsyringe';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { GroupInvitation } from '@prisma/client';
import { GroupInvitationService } from '../service/GroupInvitationService';
import { validateAuthMiddleware } from '../middleware/authMiddleware';
import { validateCelebrateMiddleware } from '../middleware/validateCelebrateMiddleware';
import { validateId } from '../middleware/celebrate/commonCelebrate';
import { validateSessionMiddleware } from '../middleware/sessionMiddleware';
import {
  validateGroupInvitation,
  validateHandlerGroupInvitation,
} from '../middleware/celebrate/groupInvitationCelebrate';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  const groupInvitationService = container.resolve(GroupInvitationService);

  fastify.post(
    '/:groupId',
    {
      preHandler: [
        validateCelebrateMiddleware<{ Params: { groupId: number } }>(
          validateGroupInvitation()
        ),
        validateAuthMiddleware(),
        validateSessionMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Params: { groupId: number } }>) => {
      fastify.log.info(
        `Criar convite de grupo pelo id ${request.params.groupId}`
      );
      const groupInvitation = {} as GroupInvitation;
      groupInvitation.groupId = request.params.groupId;
      groupInvitation.userCharacterId = request.session.userCharacterId!;
      const create = await groupInvitationService.create(groupInvitation);
      return create;
    }
  );

  fastify.get(
    '/',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async (request: FastifyRequest) => {
      fastify.log.info('Obter todos os convites do grupo');
      const getAll = await groupInvitationService.getAllByUserCharacterId(
        request.session.userCharacterId!
      );
      return getAll;
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
        `Excluir convite do personagem ${request.session.userCharacterId} pelo id ${request.params.id}`
      );
      await groupInvitationService.delete(
        request.params.id,
        request.session.userCharacterId!
      );
    }
  );

  fastify.post(
    '/accept/:id',
    {
      preHandler: [
        validateCelebrateMiddleware<{
          Params: { id: number };
        }>(validateId()),
        validateCelebrateMiddleware<{
          Querystring: { accept: boolean };
        }>(validateHandlerGroupInvitation()),
        validateAuthMiddleware(),
        validateSessionMiddleware(),
      ],
    },
    async (
      request: FastifyRequest<{
        Params: { id: number };
        Querystring: { accept: boolean };
      }>
    ) => {
      fastify.log.info(
        `Lidar com convite de grupo, opção ${request.query.accept} pelo id ${request.params.id}`
      );
      await groupInvitationService.handleInvitation(
        request.params.id,
        request.query.accept,
        request.session.userCharacterId!
      );
    }
  );

  done();
}

export default function groupInvitationController(
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) {
  fastify.register(createRoute, { prefix: '/group/invitation' });

  done();
}
