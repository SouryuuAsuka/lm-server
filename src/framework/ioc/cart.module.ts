import { Module } from '@nestjs/common';

import { CartsUseCases } from '@src/application/use-cases/cart/cart.use-cases';
import { CartsController } from '@src/presentation/controllers/';

@Module({
  imports: [],
  controllers: [CartsController],
  providers: [CartsUseCases],
})
export class CartsModule {}
