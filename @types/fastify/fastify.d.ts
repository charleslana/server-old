import { IAuth } from '../../interface/IAuth';

declare module 'fastify' {
  interface FastifyRequest {
    user: IAuth['user'];
  }
}
