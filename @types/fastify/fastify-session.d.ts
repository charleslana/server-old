import {} from '@fastify/session';

declare module '@fastify/session' {
  interface FastifySessionObject {
    userCharacterId?: number;
  }

  interface FastifySessionOptions {
    customOption?: string;
  }
}
