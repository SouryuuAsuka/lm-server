import { Injectable } from '@nestjs/common';
import { CartCookiesDto } from '@src/domain/dtos/cart';

@Injectable()
export abstract class ICartsRepository {
  abstract get(cartToken:string, cartId:number): Promise<any[]>;
  abstract getFull(cartToken:string, cartId:number): Promise<any>;
  abstract create(productId: number, token: string): Promise<any>;
  abstract addProduct(cart: any, cartToken: string, cartId: number): Promise<any>;
}
