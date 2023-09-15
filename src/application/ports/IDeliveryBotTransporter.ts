import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IDeliveryBotTransporter {
  abstract sendMessage(id: number, msg: string): any;
}
