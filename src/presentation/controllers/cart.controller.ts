import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { CartsUseCases } from '@src/application/use-cases/cart.use-case';
import { CartCookiesDto } from '@src/domain/dtos/cart';
import { Cookies } from '@src/framework/nestjs/decorators';
import { ApiTags } from '@nestjs/swagger';
import { SimpleUserGuard } from '@src/framework/nestjs/guards/auth.guard';
@ApiTags('carts')
@Controller({
  path: 'carts',
  version: '1',
})
export class CartsController {
  constructor(private cartsUseCases: CartsUseCases) { }

  @UseGuards(SimpleUserGuard)
  @Get()
  async getCart(
    @Query('type') type: string,
    @Cookies() cartCookies: CartCookiesDto) {
    return {
      status: 'success',
      data: await this.cartsUseCases.getCart(type, cartCookies),
    };
  }

  @Get(':cartId')
  async getCartById(
    @Query('type') type: string,
    @Body('cartId') cartId: number,
    @Query('cart_token') cart_token: string) {
    return {
      status: 'success',
      data: await this.cartsUseCases.getCart(type, { cart_id: cartId, cart_token }),
    };
  }


  @UseGuards(SimpleUserGuard)
  @Post(':productId')
  async createCart(@Body('productId') productId: number) {
    return {
      status: 'success',
      data: await this.cartsUseCases.createCart(productId),
    };
  }

  @UseGuards(SimpleUserGuard)
  @Patch()
  async addProductToCart(
    @Body('cart') cart: any,
    @Cookies() cartCookies: CartCookiesDto,
  ) {
    return {
      status: 'success',
      data: await this.cartsUseCases.addProductToCart(
        cart,
        cartCookies.cart_token,
        cartCookies.cart_id,
      ),
    };
  }
}
