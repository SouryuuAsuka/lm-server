import { Controller, Get, Param, Post, Body, Put, Query, Patch, Delete } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@domain/dtos/product';
import { ProductsUseCases } from '@application/use-cases/product/product.use-cases';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private productsUseCases: ProductsUseCases) { }

  @Get()
  async createProduct(
    @Body() createProductDto: CreateProductDto
  ) {
    const isAdmin = false;
    const userId = 0;
    const file = null;
    return this.productsUseCases.createProduct(isAdmin, userId, createProductDto, file);
  }

  @Patch(':productId')
  async editProduct(
    @Param('productId') productId: number,
    @Body() updateProductDto: UpdateProductDto
  ) {
    const isAdmin = true;
    const userId = 0;
    const file = null;
    return this.productsUseCases.editProduct(isAdmin, userId, productId, updateProductDto, file);
  }

  @Patch(':productId/active')
  async setActiveProduct(
    @Param('productId') productId: number,
    @Body('status') status: string
  ) {
    const isAdmin = true;
    const userId = 0;
    return this.productsUseCases.setActiveProduct(isAdmin, userId, productId, status);
  }
}