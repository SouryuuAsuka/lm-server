import {
  Controller,
  Get,
  Param,
  UseGuards,
  Body,
  Patch,
  Req,
} from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from '@src/domain/dtos/product';
import { ProductsUseCases } from '@src/application/use-cases/product.use-case';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/framework/nestjs/guards/auth.guard';
import RoleGuard from '@src/framework/nestjs/guards/role.guard';
import Role from '@src/domain/enums/role.enum';

@ApiTags('products')
@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private productsUseCases: ProductsUseCases) {}

  @UseGuards(RoleGuard(Role.Manager))
  @UseGuards(JwtAuthGuard)
  @Get()
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
  ) {
    const file = null;
    await this.productsUseCases.create(
      req.user.isAdmin,
      req.user.id,
      createProductDto,
      file,
    );
    return {
      status: 'success',
      data: {},
    };
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
    await this.productsUseCases.edit(
      req.user.isAdmin,
      req.user.id,
      productId,
      updateProductDto,
      file,
    );
    return {
      status: 'success',
      data: {},
    };
  }

  @UseGuards(RoleGuard(Role.Manager))
  @UseGuards(JwtAuthGuard)
  @Patch(':productId/active')
  async setActiveProduct(
    @Param('productId') productId: number,
    @Body('active') active: boolean,
    @Req() req: any,
  ) {
    await this.productsUseCases.setActive(
      req.user.isAdmin,
      req.user.id,
      productId,
      active,
    );
    return {
      status: 'success',
      data: {},
    };
  }
}
