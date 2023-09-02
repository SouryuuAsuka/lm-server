import { Injectable } from '@nestjs/common';
import { CartCookiesDto } from '@domain/dtos/cart';

@Injectable()
export abstract class ICartsRepository {
  abstract getCart(cart: CartCookiesDto): any
  abstract getFullCart(cart: CartCookiesDto): any
  abstract createCart(productId: number, token: string): any
  abstract addProductToCart(cart: any, cartToken:string, cartId:number): any
}