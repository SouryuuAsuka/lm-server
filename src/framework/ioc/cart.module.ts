import { Module } from '@nestjs/common';

import { ICartsRepository } from '@application/ports/ICartsRepository';
import { CartsUseCases } from '@application/use-cases/cart/cart.use-cases';
import { CartsRepository } from '@framework/database/postgresql/repository/CartsRepository';
import { CartsController } from '@presentation/controllers/cart/cart.controller';

@Module({
  imports: [],
  controllers: [CartsController],
  providers: [
    CartsUseCases,
    { provide: ICartsRepository, useClass: CartsRepository },
  ],
})
export class CartsModule {}