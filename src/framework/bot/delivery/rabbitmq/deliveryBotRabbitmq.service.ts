import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DeliveryBotRabbitmqService {
  constructor(@Inject('DELIVERY_BOT') private client: ClientProxy){}
  async sendMessage(id: number, msg: string) {
    return this.client.send({cmd:"sendMessage", id:id}, msg);
  }
}