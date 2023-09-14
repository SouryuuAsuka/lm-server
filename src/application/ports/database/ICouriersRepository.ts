import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ICouriersRepository {
  abstract getCourierList(): any;
  abstract confirmCourier(tgId: number): any;
}
