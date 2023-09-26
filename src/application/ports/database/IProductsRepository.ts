import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@src/domain/dtos/product';

@Injectable()
export abstract class IProductsRepository {
  abstract create(product: CreateProductDto):Promise<any[]>;
  abstract getOwner(productId: number):Promise<any[]>;
  abstract edit(product: UpdateProductDto):Promise<boolean>;
  abstract setActive(active: boolean, productId: number):Promise<boolean>;
}
