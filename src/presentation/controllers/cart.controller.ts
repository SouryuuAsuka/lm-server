import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Query,
  Patch,
  Res
} from '@nestjs/common';
import { CartsUseCases } from '@src/application/use-cases/cart.use-case';
import { CartCookiesDto } from '@src/domain/dtos/cart';
import { Cookies } from '@src/framework/nestjs/decorators';
import { ApiTags } from '@nestjs/swagger';
import { SimpleUserGuard } from '@src/framework/nestjs/guards/auth.guard';
import { FastifyReply } from 'fastify';

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
    const cart = await this.cartsUseCases.getCart(type, cartCookies)
    return {
      status: 'success',
      data: {
        cart: cart[0]?.order_array ?? []
      },
    };
  }

  @Get(':cartId')
  async getCartById(
    @Query('type') type: string,
    @Body('cartId') cartId: number,
    @Query('cart_token') cart_token: string) {
    const cart = await this.cartsUseCases.getCart(type, { cart_id: cartId, cart_token });
    return {
      status: 'success',
      data: {
        cart: cart[0]?.order_array ?? []
      },
    };
  }

  @UseGuards(SimpleUserGuard)
  @Post()
  async createCart(
    @Body('productId') productId: number,
    @Res({ passthrough: true }) res: FastifyReply,
  ) {
    const { cartId, token } = await this.cartsUseCases.createCart(productId);
    res.cookie('cart_id', cartId, {
      domain: process.env.SERVER_DOMAIN,
    });
    res.cookie('cart_token', token, {
      domain: process.env.SERVER_DOMAIN,
    });
    return res.send({
      status: 'success',
      data: {}
    });
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
