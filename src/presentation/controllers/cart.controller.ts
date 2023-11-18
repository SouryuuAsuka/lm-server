import {
  Controller,
  Get,
  UseGuards,
  Post,
  Body,
  Query,
  Patch,
  Res,
  Param
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
    @Cookies() cartCookies: CartCookiesDto,
    @Query('type') type?: string) {
    const data = await this.cartsUseCases.getCart(type, cartCookies)
    return {
      status: 'success',
      data
    };
  }

  @Get(':cartId')
  async getCartById(
    @Query('type') type: string,
    @Param('cartId') cartId: number,
    @Query('cart_token') cart_token: string) {
    const data = await this.cartsUseCases.getCart(type, { cart_id: cartId, cart_token });
    return {
      status: 'success',
      data
    };
  }

  @UseGuards(SimpleUserGuard)
  @Post()
  async createCart(
    @Body('productId') productId: number,
    @Res({ passthrough: true }) res: FastifyReply,
    @Body('twa') twa?: boolean,
  ) {
    const { cartId, token } = await this.cartsUseCases.createCart(productId);
    if (!twa) {
      res.cookie('cart_id', cartId, {
        domain: process.env.SERVER_DOMAIN,
        path: '/'
      });
      res.cookie('cart_token', token, {
        domain: process.env.SERVER_DOMAIN,
        path: '/'
      });
      return res.send({
        status: 'success',
        data: {}
      });
    }
    return res.send({
      status: 'success',
      data: {
        cart_id: cartId,
        cart_token: token,
      }
    });

  }

  @UseGuards(SimpleUserGuard)
  @Patch()
  async addProductToCart(
    @Body('cart') cart: any,
    @Cookies() cartCookies?: CartCookiesDto,
    @Body('cart_id') cart_id?: number,
    @Body('cart_token') cart_token?: string,
  ) {
    return {
      status: 'success',
      data: await this.cartsUseCases.addProductToCart(
        cart,
        cartCookies.cart_token ?? cart_token,
        cartCookies.cart_id ?? cart_id,
      ),
    };
  }
}
