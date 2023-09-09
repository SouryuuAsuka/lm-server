import { Controller, Get, Param, UseGuards, Post, Body, Put, Query, Patch, Req } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@domain/dtos/product';
import { ProductsUseCases } from '@application/use-cases/product/product.use-cases';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, SimpleUserGuard } from '@framework/nestjs/guards/auth.guard';
import RoleGuard from '@framework/nestjs/guards/role.guard';
import Role from '@domain/enums/role.enum';

@ApiTags('products')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private productsUseCases: ProductsUseCases) { }

  @UseGuards(RoleGuard(Role.Manager))
  @UseGuards(JwtAuthGuard)
  @Get()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
  ) {
    const file = null;
    await this.productsUseCases.createProduct(req.user.isAdmin, req.user.id, createProductDto, file);
    return {
      status: "success",
      data: {}
    } 
  }

  @UseGuards(RoleGuard(Role.Manager))
  @UseGuards(JwtAuthGuard)
  @Patch(':productId')
  async editProduct(
    @Param('productId') productId: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: any,
  ) {
    const file = null;
    await this.productsUseCases.editProduct(req.user.isAdmin, req.user.id, productId, updateProductDto, file);
    return {
      status: "success",
      data: {}
    } 
  }
  
  @UseGuards(RoleGuard(Role.Manager))
  @UseGuards(JwtAuthGuard)
  @Patch(':productId/active')
  async setActiveProduct(
    @Param('productId') productId: number,
    @Body('status') status: string,
    @Req() req: any,
  ) {
    await this.productsUseCases.setActiveProduct(req.user.isAdmin, req.user.id, productId, status);
    return {
      status: "success",
      data: {}
    }
  }
}