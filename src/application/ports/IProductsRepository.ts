import { Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@domain/dtos/product';

@Injectable()
export abstract class IProductsRepository {
  abstract createProduct( product: CreateProductDto)
  abstract getOwnerOfProduct( productId: number)
  abstract editProduct( product: UpdateProductDto) 
  abstract setActiveProduct( status: string, productId: number )
}