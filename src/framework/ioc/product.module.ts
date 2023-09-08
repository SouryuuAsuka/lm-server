import { Module } from '@nestjs/common';

import { ProductsUseCases } from '@application/use-cases/product/product.use-cases';
import { ProductsController } from '@presentation/controllers/';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [
    ProductsUseCases,
  ],
})
export class ProductsModule {}