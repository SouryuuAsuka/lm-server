import { Module } from '@nestjs/common';

import { CartsUseCases } from '@src/application/use-cases/cart.use-case';
import { CartsController } from '@src/presentation/controllers/';

@Module({
  imports: [],
  controllers: [CartsController],
  providers: [CartsUseCases],
})
export class CartsModule {}
