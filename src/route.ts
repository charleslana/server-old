import characterController from './controller/characterController';
import groupController from './controller/groupController';
import socketController from './controller/socketController';
import userCharacterController from './controller/userCharacterController';
import userCharacterGroupController from './controller/userCharacterGroupController';
import userCharacterItemController from './controller/userCharacterItemController';
import userCharacterSkillController from './controller/userCharacterSkillController';
import userController from './controller/userController';
import { FastifyInstance } from 'fastify';

export default function registerRoutes(server: FastifyInstance) {
  server.register(socketController, { prefix: '/v1' });
  server.register(userController, { prefix: '/v1' });
  server.register(characterController, { prefix: '/v1' });
  server.register(userCharacterController, { prefix: '/v1' });
  server.register(userCharacterItemController, { prefix: '/v1' });
  server.register(userCharacterSkillController, { prefix: '/v1' });
  server.register(groupController, { prefix: '/v1' });
  server.register(userCharacterGroupController, { prefix: '/v1' });
}
