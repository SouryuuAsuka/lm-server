import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TechBotRabbitmqService {
  constructor(@Inject('TECH_BOT') private client: ClientProxy){}
  async sendMessage(id: number, msg: string) {
    return this.client.send({cmd:"sendMessage"}, {id, msg});
  }
}