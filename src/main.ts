import characterController from './controller/characterController';
import cors from '@fastify/cors';
import fastify, { FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import routesController from './controller/routesController';
import socketController from './controller/socketController';
import socketioServer from 'fastify-socket.io';
import userController from './controller/userController';
import { GlobalError } from './handler/GlobalError';
import { PrismaClient } from '@prisma/client';

const server: FastifyInstance = fastify({
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

server.register(cors, {
  origin: '*',
  credentials: true,
});

server.register(fastifyCookie);

server.register(fastifySession, {
  secret: process.env.SESSION_SECRET as string,
  cookie: {
    secure: process.env.COOKIE_SECURE as unknown as boolean,
  },
});

server.register(socketioServer);

server.register(userController, { prefix: '/v1' });

server.register(characterController, { prefix: '/v1' });

server.register(routesController);

server.register(socketController);

server.setErrorHandler((error, _request, reply) => {
  if (error instanceof SyntaxError && error.message.includes('JSON')) {
    return reply.status(400).send({ message: 'Invalid JSON data' });
  }
  if (
    error instanceof Error &&
    error.message.includes('Unsupported Media Type')
  ) {
    return reply.status(400).send({ message: error.message });
  }
  if (error instanceof GlobalError) {
    const statusCode = error.statusCode || 500;
    return reply.status(statusCode).send({
      message: error.message,
    });
  }
  reply.status(500).send({
    message: 'Internal Server Error',
    error: error.message,
  });
});

server.setNotFoundHandler((_request, reply) => {
  reply.status(404).send({
    message: 'Rota não encontrada',
  });
});

const start = async () => {
  try {
    const prisma = new PrismaClient();
    await prisma.$connect();
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    await server.listen({ port: port });
    server.log.info(`Server listening on ${server.server.address()}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
