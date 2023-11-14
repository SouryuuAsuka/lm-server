import { Injectable } from '@nestjs/common';
import { ICartsRepository } from '@src/application/ports/database/ICartsRepository';
import { CartCookiesDto } from '@src/domain/dtos/cart';

@Injectable()
export class CartsUseCases {
  constructor(private readonly cartRepository: ICartsRepository) {}
  async getCart(type: string, cartCookie: CartCookiesDto) {
    if (type === 'full') {
      const cart = await this.cartRepository.getFull(cartCookie.cart_token, cartCookie.cart_id);
      console.log(cart);
      return cart
    } else {
      const cart = await this.cartRepository.get(cartCookie.cart_token, cartCookie.cart_id);
      return {cart: cart[0].order_array};
    }
  }
  async createCart(productId: number) {
    function generateRandomString(length: number) {
      const characters =
        '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let result = '';
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length),
        );
      }
      return result;
    }
    const token = generateRandomString(6);

    return await this.cartRepository.create(productId, token);
  }
  async addProductToCart(cart: any, cartToken: string, cartId: number) {
    return await this.cartRepository.addProduct(cart, cartToken, cartId);
  }
}
