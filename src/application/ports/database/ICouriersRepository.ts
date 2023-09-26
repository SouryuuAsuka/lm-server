import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ICouriersRepository {
  abstract getList(): Promise<any>;
  abstract confirm(tgId: number): Promise<any[]>;
}
