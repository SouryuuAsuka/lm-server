import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TechBotRabbitmqService } from './techBotRabbitmq.service';
import { ITechBotTransporter } from '@src/application/ports/ITechBotTransporter';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TECH_BOT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://lm-rabbitmq:5672'],
          queue: 'tbot.sendMessage',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  providers: [{ provide: ITechBotTransporter, useClass: TechBotRabbitmqService }],
  exports: [ITechBotTransporter],
})
export class TechBotRabbitmq { }
