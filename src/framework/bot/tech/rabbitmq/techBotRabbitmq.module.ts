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
          urls: [`amqp://${process.env.RABBITMQ_DEFAULT_USER}:${process.env.RABBITMQ_DEFAULT_PASS}@lm-rabbitmq:5672`],
          queue: 'tbot',
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
