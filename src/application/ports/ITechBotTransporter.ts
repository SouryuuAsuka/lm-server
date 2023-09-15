import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ITechBotTransporter {
  abstract sendMessage(id: number, msg: string): any;
}
