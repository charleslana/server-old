import { AuthService } from '../service/AuthService';
import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { GlobalError } from '../handler/GlobalError';
import { UserService } from '../service/UserService';

export function validateAuthMiddleware<T extends RouteGenericInterface>() {
  return (
    request: FastifyRequest<T>,
    reply: FastifyReply,
    doneHook: () => void
  ) => {
    const token = request.headers.authorization;
    if (!token) {
      throw new GlobalError('Usuário não autenticado', 401);
    }
    const authService = new AuthService();
    const decodedToken = authService.verifyJwtToken(token!);
    const userService = new UserService();
    userService
      .getAuth(decodedToken.user.id, decodedToken.user.authToken ?? '')
      .then(userLogged => {
        if (!userLogged) {
          reply
            .code(401)
            .send(new GlobalError('Usuário autenticado em outra sessão', 401));
          return;
        }
        request.user = decodedToken.user;
        doneHook();
      });
  };
}
