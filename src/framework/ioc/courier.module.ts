import { Module } from '@nestjs/common';

import { ICouriersRepository } from '@application/ports/ICouriersRepository';
import { CouriersUseCases } from '@application/use-cases/courier/courier.use-cases';
import { CouriersRepository } from '@framework/database/postgresql/repository/CouriersRepository';
import { CouriersController } from '@presentation/controllers/courier/courier.controller';

@Module({
  imports: [],
  controllers: [CouriersController],
  providers: [
    CouriersUseCases,
    { provide: ICouriersRepository, useClass: CouriersRepository },
  ],
})
export class CouriersModule {}