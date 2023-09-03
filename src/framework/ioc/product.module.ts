import { Module } from '@nestjs/common';

import { ProductsUseCases } from '@application/use-cases/product/product.use-cases';
import { ProductsController } from '@presentation/controllers/product/product.controller';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [
    ProductsUseCases,
  ],
})
export class ProductsModule {}