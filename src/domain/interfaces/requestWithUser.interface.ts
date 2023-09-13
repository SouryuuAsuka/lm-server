import { FastifyRequest } from 'fastify';

export default interface RequestWithUser extends FastifyRequest {
  user: any;
}
