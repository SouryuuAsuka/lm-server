import { Injectable } from '@nestjs/common';
import { IProductsRepository } from '@src/application/ports/database/IProductsRepository';
import { IOrgsRepository } from '@src/application/ports/database/IOrgsRepository';
import { IAwsService } from '@src/application/ports/IAwsService';
import { CreateProductDto, UpdateProductDto } from '@src/domain/dtos/product';

@Injectable()
export class ProductsUseCases {
  constructor(
    private readonly productsRepository: IProductsRepository,
    private readonly orgsRepository: IOrgsRepository,
    private readonly awsRepository: IAwsService,
  ) {}
  async create(
    isAdmin: boolean,
    userId: number,
    product: CreateProductDto,
    file: any,
  ) {
    let fullAccess = false;
    if (isAdmin) {
      fullAccess = true;
    } else {
      const ownerId = await this.orgsRepository.getOwner(userId);
      if (userId == ownerId) {
        fullAccess = true;
      }
    }
    if (fullAccess) {
      const productId = await this.productsRepository.create(product);
      await this.awsRepository.savePicture(file, productId, 'products');
      return true;
    } else {
      throw 'Ошибка доступа';
    }
  }
  async edit(
    isAdmin: boolean,
    userId: number,
    productId: number,
    product: UpdateProductDto,
    file: any,
  ) {
    let fullAccess = false;
    if (isAdmin) {
      fullAccess = true;
    } else {
      const ownerId =
        await this.productsRepository.getOwner(productId);
      if (userId == ownerId) {
        fullAccess = true;
      }
    }
    if (fullAccess) {
      await this.productsRepository.edit(product);
      await this.awsRepository.savePicture(file, product.productId, 'products');
      return true;
    } else {
      throw 'Ошибка доступа';
    }
  }
  async setActive(
    isAdmin: boolean,
    userId: number,
    productId: number,
    active: boolean,
  ) {
    let fullAccess = false;
    if (isAdmin) {
      fullAccess = true;
    } else {
      const ownerId =
        await this.productsRepository.getOwner(productId);
      if (userId == ownerId) {
        fullAccess = true;
      }
    }
    if (fullAccess) {
      await this.productsRepository.setActive(active, productId);
      return true;
    } else {
      throw 'Ошибка доступа';
    }
  }
}
