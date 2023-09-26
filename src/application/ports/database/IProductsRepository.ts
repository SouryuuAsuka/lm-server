import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@src/domain/dtos/product';

@Injectable()
export abstract class IProductsRepository {
  abstract create(product: CreateProductDto);
  abstract getOwner(productId: number);
  abstract edit(product: UpdateProductDto);
  abstract setActive(active: boolean, productId: number);
}
