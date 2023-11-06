import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class TechBotRabbitmqService {
  constructor(@Inject('TECH_BOT') private client: ClientProxy) { }
  async sendMessage(id: number, msg: string) {
    const result = this.client.send("sendMessage", { id, msg });
    result.subscribe();
    return true;
  }
}