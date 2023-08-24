import { FastifyReply, FastifyRequest } from 'fastify';
import { GlobalError } from '../handler/GlobalError';
import { RoleEnum } from '@prisma/client';

export function validateRoleMiddleware(allowedRoles: RoleEnum[]) {
  return (
    request: FastifyRequest,
    _reply: FastifyReply,
    doneHook: () => void
  ) => {
    const userRoles = request.user.roles;
    const hasPermission = userRoles.some(role =>
      allowedRoles.includes(role.name)
    );
    if (!hasPermission) {
      throw new GlobalError('Usuário não autorizado', 403);
    }
    doneHook();
  };
}
