import { Injectable } from '@nestjs/common';
import { IProductsRepository } from '@application/ports/IProductsRepository';
import { IOrgsRepository } from '@application/ports/IOrgsRepository';
import { IAwsService } from '@application/ports/IAwsService';
import { CreateProductDto, UpdateProductDto } from '@domain/dtos/product';

@Injectable()
export class ProductsUseCases {
  constructor(
    private readonly productsRepository: IProductsRepository,
    private readonly orgsRepository: IOrgsRepository,
    private readonly awsRepository: IAwsService,
  ) { }
  async createProduct(isAdmin: boolean, userId: number, product: CreateProductDto, file: any) {
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
      const productId = await this.productsRepository.createProduct(product);
      await this.awsRepository.savePicture(file, productId, 'products');
      return true;
    } else {
      throw "Ошибка доступа";
    }
  }
  async editProduct(isAdmin: boolean, userId: number, productId: number, product: UpdateProductDto, file: any) {
    let fullAccess = false;
    if (isAdmin) {
      fullAccess = true;
    } else {
      const ownerId = await this.productsRepository.getOwnerOfProduct(productId)
      if (userId == ownerId) {
        fullAccess = true;
      }
    }
    if (fullAccess) {
      await this.productsRepository.editProduct(product);
      await this.awsRepository.savePicture(file, product.productId, 'products');
      return true;
    } else {
      throw "Ошибка доступа";
    }
  }
  async setActiveProduct(isAdmin: boolean, userId: number, productId: number, status: string) {
    let fullAccess = false;
    if (isAdmin) {
      fullAccess = true;
    } else {
      const ownerId = await this.productsRepository.getOwnerOfProduct(productId)
      if (userId == ownerId) {
        fullAccess = true;
      }
    }
    if (fullAccess) {
      await this.productsRepository.setActiveProduct(status, productId);
      return true;
    } else {
      throw "Ошибка доступа";
    }
  }
}