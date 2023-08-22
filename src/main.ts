import cors from '@fastify/cors';
import fastify, { FastifyInstance } from 'fastify';
import routesController from './controller/routesController';
import socketController from './controller/socketController';
import socketioServer from 'fastify-socket.io';
import userController from './controller/userController';

const server: FastifyInstance = fastify({ logger: true });

server.register(cors, {
  origin: '*',
  credentials: true,
});

server.register(socketioServer);

server.register(userController, { prefix: '/v1' });

server.register(routesController);

server.register(socketController);

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
