import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IClientBotTransporter {
  abstract sendMessage(id: number, msg: string): any;
}
