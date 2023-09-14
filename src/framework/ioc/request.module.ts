import { Module } from '@nestjs/common';

import { RequestsUseCases } from '@src/application/use-cases/request.use-case';
import { RequestsController } from '@src/presentation/controllers/';

@Module({
  imports: [],
  controllers: [RequestsController],
  providers: [RequestsUseCases],
})
export class RequestsModule {}
