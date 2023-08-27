import 'reflect-metadata';
import cors from '@fastify/cors';
import CronJobService from './service/CronjobService';
import fastify, { FastifyInstance } from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import registerRoutes from './route';
import socketioServer from 'fastify-socket.io';
import { container } from './container';
import { GlobalError } from './handler/GlobalError';
import { PrismaClient } from '@prisma/client';

const server: FastifyInstance = fastify({
  disableRequestLogging: true,
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

registerRoutes(server);

server.decorate('container', container);

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
  server.log.error(error.message);
});

server.setNotFoundHandler((request, reply) => {
  server.log.error(`Rota não encontrada ${request.raw.url}`);
  reply.status(404).send({
    message: 'Rota não encontrada',
  });
});

const start = async () => {
  try {
    const prisma = new PrismaClient();
    await prisma
      .$connect()
      .then(() => server.log.info('Banco de dados conectado com sucesso'));
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    await server.listen({ port: port });
    server.log.info(`Servidor conectado na porta ${port}`);
    const cron = new CronJobService(server);
    cron.start();
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
