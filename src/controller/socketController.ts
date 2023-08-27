import { FastifyInstance } from 'fastify';
import { join } from 'path';
import { readFile } from 'fs/promises';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  fastify.get('/html', async (_request, reply) => {
    const data = await readFile(join(__dirname, '..', '..', 'index.html'));
    reply.header('content-type', 'text/html; charset=utf-8');
    reply.send(data);
  });

  fastify.io.on('connection', socket => {
    fastify.log.info('a user connected');
    socket.on('disconnect', () => {
      fastify.log.info('user disconnected');
    });

    socket.on('chat message', msg => {
      fastify.log.info('message: ' + msg);
      fastify.io.emit('chat message', msg);
    });
  });

  done();
}

export default function socketController(
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) {
  fastify.register(createRoute, { prefix: '/socket' });

  done();
}
