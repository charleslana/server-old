import { container } from 'tsyringe';
import { FastifyInstance, FastifyRequest } from 'fastify';
import { GroupService } from '../service/GroupService';
import { IGroup } from '../interface/IGroup';
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

  fastify.post(
    '/',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateCelebrateMiddleware<{ Body: IGroup }>(validateCreateGroup()),
        validateAuthMiddleware(),
        validateSessionMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Body: IGroup }>) => {
      const userCharacterGroup = {} as UserCharacterGroup;
      userCharacterGroup.userCharacterId = request.session.userCharacterId!;
      request.body.UserCharacterGroup = userCharacterGroup;
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
      const get = await groupService.getById(request.params.id);
      return get;
    }
  );

  fastify.put(
    '/name',
    {
      preHandler: [
        validateBodyMiddleware(),
        validateCelebrateMiddleware<{ Body: IGroup }>(
          validateUpdateGroupName()
        ),
        validateAuthMiddleware(),
        validateSessionMiddleware(),
      ],
    },
    async (request: FastifyRequest<{ Body: IGroup }>) => {
      const userCharacterGroup = {} as UserCharacterGroup;
      userCharacterGroup.userCharacterId = request.session.userCharacterId!;
      request.body.UserCharacterGroup = userCharacterGroup;
      const update = await groupService.updateName(request.body);
      return update;
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
      await groupService.delete(request.params.id);
    }
  );

  fastify.get(
    '/requirements',
    {
      preHandler: [validateAuthMiddleware(), validateSessionMiddleware()],
    },
    () => {
      const get = groupService.getGroupRequirements();
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
