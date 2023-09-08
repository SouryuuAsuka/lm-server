import { Module } from '@nestjs/common';

import { RequestsUseCases } from '@application/use-cases/request/request.use-cases';
import { RequestsController } from '@presentation/controllers/';

@Module({
  imports: [],
  controllers: [RequestsController],
  providers: [
    RequestsUseCases,
  ],
})
export class RequestsModule {}