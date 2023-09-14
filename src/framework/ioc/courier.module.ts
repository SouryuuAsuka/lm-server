import { Module } from '@nestjs/common';

import { CouriersUseCases } from '@src/application/use-cases/courier/courier.use-cases';
import { CouriersController } from '@src/presentation/controllers';

@Module({
  imports: [],
  controllers: [CouriersController],
  providers: [CouriersUseCases],
})
export class CouriersModule {}
