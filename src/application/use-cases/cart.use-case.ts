import { Injectable } from '@nestjs/common';
import { ICartsRepository } from '@src/application/ports/database/ICartsRepository';
import { CartCookiesDto } from '@src/domain/dtos/cart';

@Injectable()
export class CartsUseCases {
  constructor(private readonly cartRepository: ICartsRepository) {}
  async getCart(type: string, cart: CartCookiesDto) {
    if (type === 'full') {
      return await this.cartRepository.getFullCart(cart);
    } else {
      return await this.cartRepository.getCart(cart);
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

    return await this.cartRepository.createCart(productId, token);
  }
  async addProductToCart(cart: any, cartToken: string, cartId: number) {
    return await this.cartRepository.addProductToCart(cart, cartToken, cartId);
  }
}
