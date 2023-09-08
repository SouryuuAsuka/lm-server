import { Module } from '@nestjs/common';

import { CartsUseCases } from '@application/use-cases/cart/cart.use-cases';
import { CartsController } from '@presentation/controllers/';

@Module({
  imports: [],
  controllers: [CartsController],
  providers: [
    CartsUseCases,
  ],
})
export class CartsModule {}