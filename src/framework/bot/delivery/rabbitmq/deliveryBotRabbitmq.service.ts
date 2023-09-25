import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class DeliveryBotRabbitmqService {
  constructor(@Inject('DELIVERY_BOT') private client: ClientProxy){}
  async sendMessage(data: any) {
    return this.client.send({cmd:"sendMessage"}, data);
  }
}