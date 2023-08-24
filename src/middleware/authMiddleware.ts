import { AuthService } from '../service/AuthService';
import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { GlobalError } from '../handler/GlobalError';

export function validateAuthMiddleware<T extends RouteGenericInterface>() {
  return (
    request: FastifyRequest<T>,
    _reply: FastifyReply,
    doneHook: () => void
  ) => {
    const token = request.headers.authorization;
    if (!token) {
      throw new GlobalError('Usuário não autenticado', 403);
    }
    const authService = new AuthService();
    const decodedToken = authService.verifyJwtToken(token!);
    request.user = decodedToken.user;
    doneHook();
  };
}
