import { Module } from '@nestjs/common';

import { CouriersUseCases } from '@src/application/use-cases/courier.use-case';
import { CouriersController } from '@src/presentation/controllers';

@Module({
  imports: [],
  controllers: [CouriersController],
  providers: [CouriersUseCases],
})
export class CouriersModule {}
