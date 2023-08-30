import { container } from 'tsyringe';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { GroupService } from '../service/GroupService';
import { IGroup } from '../interface/IGroup';
import { sanitizeHtmlMiddleware } from '../middleware/sanitizeHtmlMiddleware';
import { UploadService } from '../service/UploadService';
import { UserCharacterGroup } from '@prisma/client';
import { validateAuthMiddleware } from '../middleware/authMiddleware';
import { validateBodyMiddleware } from '../middleware/validateBodyMiddleware';
import { validateCelebrateMiddleware } from '../middleware/validateCelebrateMiddleware';
import { validateId } from '../middleware/celebrate/commonCelebrate';
import { validateSessionMiddleware } from '../middleware/sessionMiddleware';
import {
  validateCreateGroup,
  validateUpdateGroupName,
} from '../middleware/celebrate/groupCelebrate';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  const groupService = container.resolve(GroupService);
  const uploadService = new UploadService();

  fastify.post(
    '/',
    {
      preHandler: [
        validateBodyMiddleware(),
        sanitizeHtmlMiddleware(),
        validateCelebrateMiddleware<{ Body: IGroup }>(validateCreateGroup()),
        validateAuthMiddleware(),
        validateSessionMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Body: IGroup }>) => {
      fastify.log.info('Criar grupo');
      const userCharacterGroup = {} as UserCharacterGroup;
      userCharacterGroup.userCharacterId = request.session.userCharacterId!;
      request.body.userCharacterGroup = userCharacterGroup;
      const create = await groupService.create(request.body);
      return create;
    }
  );

  fastify.get(
    '/',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async () => {
      fastify.log.info('Obter todos os grupos');
      const getAll = await groupService.getAll();
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
      fastify.log.info(`Obter grupo pelo id ${request.params.id}`);
      const get = await groupService.getById(request.params.id);
      return get;
    }
  );

  fastify.put(
    '/name',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateCelebrateMiddleware<{ Body: { name: string } }>(
          validateUpdateGroupName()
        ),
        validateAuthMiddleware(),
        validateSessionMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Body: { name: string } }>) => {
      fastify.log.info('Atualizar nome do grupo');
      const update = await groupService.updateName(
        request.session.userCharacterId!,
        request.body.name
      );
      return update;
    }
  );

  fastify.delete(
    '/',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async (request: FastifyRequest) => {
      fastify.log.info('Excluir grupo');
      await groupService.delete(request.session.userCharacterId!);
    }
  );

  fastify.get(
    '/requirements',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    () => {
      fastify.log.info('Obter requerimentos do grupo');
      const get = groupService.getGroupRequirements();
      return get;
    }
  );

  fastify.get(
    '/profile',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async (request: FastifyRequest) => {
      fastify.log.info('Obter perfil do grupo');
      const get = await groupService.getByUserCharacterId(
        request.session.userCharacterId!
      );
      return get;
    }
  );

  fastify.put(
    '/image',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    async (request: FastifyRequest) => {
      fastify.log.info('Atualizar imagem do grupo');
      const get = await uploadService.send(request);
      return get;
    }
  );

  done();
}

export default function groupController(
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) {
  fastify.register(createRoute, { prefix: '/group' });

  done();
}
