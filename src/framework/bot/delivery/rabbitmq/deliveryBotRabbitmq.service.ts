import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DeliveryBotRabbitmqService {
  constructor(@Inject('DELIVERY_BOT') private client: ClientProxy){}
  async sendMessage(id: number, msg: string) {
    const result = this.client.send("sendMessage", { id, msg });
    result.subscribe();
    return true;
  }
}