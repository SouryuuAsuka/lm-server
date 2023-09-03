import { Module } from '@nestjs/common';

import { CartsUseCases } from '@application/use-cases/cart/cart.use-cases';
import { CartsController } from '@presentation/controllers/cart/cart.controller';

@Module({
  imports: [],
  controllers: [CartsController],
  providers: [
    CartsUseCases,
  ],
})
export class CartsModule {}