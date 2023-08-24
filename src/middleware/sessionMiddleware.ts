import { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { GlobalError } from '../handler/GlobalError';

export function validateSessionMiddleware<T extends RouteGenericInterface>() {
  return (
    request: FastifyRequest<T>,
    _reply: FastifyReply,
    doneHook: () => void
  ) => {
    const session = request.session.userCharacterId;
    if (!session) {
      throw new GlobalError('Sessão não selecionada', 403);
    }
    doneHook();
  };
}
