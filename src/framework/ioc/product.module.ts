import { Module } from '@nestjs/common';

import { IProductsRepository } from '@application/ports/IProductsRepository';
import { ProductsUseCases } from '@application/use-cases/product/product.use-cases';
import { ProductsRepository } from '@framework/database/postgresql/repository/ProductsRepository';
import { ProductsController } from '@presentation/controllers/product/product.controller';

@Module({
  imports: [],
  controllers: [ProductsController],
  providers: [
    ProductsUseCases,
    { provide: IProductsRepository, useClass: ProductsRepository },
  ],
})
export class ProductsModule {}