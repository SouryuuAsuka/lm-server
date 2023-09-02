import { Controller, Get, Param, Post, Body, Put, Query, Patch, Delete } from '@nestjs/common';
import { CartsUseCases } from '@application/use-cases/cart/cart.use-cases';
import { CartCookiesDto } from '@domain/dtos/cart';
import { Cookies } from '@framework/nestjs/decorators';
@Controller('couriers')
export class CartsController {
  constructor(private cartsUseCases: CartsUseCases) { }

  @Get()
  async getCart(
    @Query() type: string,
    @Cookies() cartCookies: CartCookiesDto
  ) {
    return this.cartsUseCases.getCart(type, cartCookies);
  }

  @Post()
  async createCart(
    @Body('productId') productId: number
  ) {
    return this.cartsUseCases.createCart(productId);
  }

  @Patch()
  async addProductToCart(
    @Body('cart') cart: any,
    @Cookies() cartCookies: CartCookiesDto
  ) {
    return this.cartsUseCases.addProductToCart(cart, cartCookies.cart_token, cartCookies.cart_id);
  }
}