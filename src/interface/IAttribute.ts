import { AttributeEnum } from '../enum/AttributeEnum';
import { FastifyReply } from 'fastify';

export interface IAttribute {
  attribute: AttributeEnum;
  point: number;
  id: number;
  userId: number;
  reply: FastifyReply;
}
