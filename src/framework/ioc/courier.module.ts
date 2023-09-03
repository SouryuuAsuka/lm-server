import { Module } from '@nestjs/common';

import { CouriersUseCases } from '@application/use-cases/courier/courier.use-cases';
import { CouriersController } from '@presentation/controllers/courier/courier.controller';

@Module({
  imports: [],
  controllers: [CouriersController],
  providers: [
    CouriersUseCases,
  ],
  
})
export class CouriersModule {}