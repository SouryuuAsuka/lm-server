import { Injectable } from '@nestjs/common';
import { CartCookiesDto } from '@domain/dtos/cart';

@Injectable()
export abstract class ICouriersRepository {
  abstract getCourierList(): any
  abstract confirmCourier(tgId: number): any
}