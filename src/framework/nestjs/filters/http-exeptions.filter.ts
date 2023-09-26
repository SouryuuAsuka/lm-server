import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { FastifyRequest, FastifyReply } from 'fastify';
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LoggerService) { }
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response: FastifyReply = ctx.getResponse<FastifyReply>();
    const request: FastifyRequest = ctx.getRequest<FastifyRequest>();
    const status = exception.getStatus();
    this.logger.error(exception);
    
    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: exception.message,
    });
  }
}
