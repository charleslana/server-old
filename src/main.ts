import cors from '@fastify/cors';
import fastify, { FastifyInstance } from 'fastify';
import routesController from './controller/routesController';
import socketController from './controller/socketController';
import socketioServer from 'fastify-socket.io';
import userController from './controller/userController';
import { GlobalError } from './handler/GlobalError';

const server: FastifyInstance = fastify({ logger: true });

server.register(cors, {
  origin: '*',
  credentials: true,
});

server.register(socketioServer);

server.register(userController, { prefix: '/v1' });

server.register(routesController);

server.register(socketController);

server.setErrorHandler((error, _request, reply) => {
  if (error instanceof GlobalError) {
    const statusCode = error.statusCode || 500;
    reply.status(statusCode).send({
      message: error.message,
    });
  } else {
    reply.status(500).send({
      message: 'Internal Server Error',
      error: error.message,
    });
  }
});

server.setNotFoundHandler((_request, reply) => {
  reply.status(404).send({
    message: 'Rota não encontrada',
  });
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });
    server.log.info(`Server listening on ${server.server.address()}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
