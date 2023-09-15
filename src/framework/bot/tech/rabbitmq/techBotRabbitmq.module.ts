import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TechBotRabbitmqService } from './techBotRabbitmq.service';
import { ITechBotTransporter } from '@src/application/ports/ITechBotTransporter';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DELIVERY_BOT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'server_to_tech_bot',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  providers: [{ provide: ITechBotTransporter, useClass: TechBotRabbitmqService }]
})
export class TechBotRabbitmq { }
