import fs from 'fs';
import mimeTypes from 'mime-types';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { UploadService } from '../service/UploadService';
import { validateCelebrateMiddleware } from '../middleware/validateCelebrateMiddleware';
import { validateString } from '../middleware/celebrate/commonCelebrate';

function createRoute(fastify: FastifyInstance, _: unknown, done: () => void) {
  const uploadService = new UploadService();

  fastify.get(
    '/group/image/:fileName',
    {
      preHandler: [
        validateCelebrateMiddleware<{ Params: { fileName: string } }>(
          validateString()
        ),
      ],
    },
    async (
      request: FastifyRequest<{ Params: { fileName: string } }>,
      reply: FastifyReply
    ) => {
      fastify.log.info('Obter imagem do grupo');
      const filePath = await uploadService.getFile(request.params.fileName);
      const mimeType = mimeTypes.lookup(request.params.fileName);
      if (mimeType) {
        reply.header('Content-Type', mimeType);
      }
      const readStream = fs.createReadStream(filePath);
      return reply.send(readStream);
    }
  );

  done();
}

export default function publicController(
  fastify: FastifyInstance,
  _: unknown,
  done: () => void
) {
  fastify.register(createRoute, { prefix: '/public' });

  done();
}
