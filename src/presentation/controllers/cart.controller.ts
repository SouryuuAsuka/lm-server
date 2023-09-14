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
  async getCart(@Query() type: string, @Cookies() cartCookies: CartCookiesDto) {
    return {
      status: 'success',
      data: await this.cartsUseCases.getCart(type, cartCookies),
    };
  }

  @UseGuards(SimpleUserGuard)
  @Post()
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
