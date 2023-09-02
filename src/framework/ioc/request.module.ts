import { Module } from '@nestjs/common';

import { IRequestsRepository } from '@application/ports/IRequestsRepository';
import { RequestsUseCases } from '@application/use-cases/request/request.use-cases';
import { RequestsRepository } from '@framework/database/postgresql/repository/RequestsRepository';
import { RequestsController } from '@presentation/controllers/request/request.controller';

@Module({
  imports: [],
  controllers: [RequestsController],
  providers: [
    RequestsUseCases,
    { provide: IRequestsRepository, useClass: RequestsRepository },
  ],
})
export class RequestsModule {}