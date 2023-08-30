import { IAuth } from '../../src/interface/IAuth';

declare module 'fastify' {
  interface FastifyRequest {
    user: IAuth['user'];
  }
}
