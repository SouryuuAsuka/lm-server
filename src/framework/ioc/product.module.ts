import { Module } from '@nestjs/common';

import { ProductsUseCases } from '@src/application/use-cases/product/product.use-cases';
import { ProductsController } from '@src/presentation/controllers/';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [ProductsUseCases],
})
export class ProductsModule {}
