import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ClientBotRabbitmqService {
  constructor(@Inject('CLIENT_BOT') private client: ClientProxy){}
  async sendMessage(data:any) {
    return this.client.send({cmd:"sendMessage"}, data);
  }
}