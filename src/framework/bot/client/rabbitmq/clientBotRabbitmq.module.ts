import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ClientBotRabbitmqService } from './clientBotRabbitmq.service';
import { IClientBotTransporter } from '@src/application/ports/IClientBotTransporter';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'CLIENT_BOT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://lm-rabbitmq:5672'],
          queue: 'cbot',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  providers: [{ provide: IClientBotTransporter, useClass: ClientBotRabbitmqService }],
  exports: [IClientBotTransporter],
})
export class ClientBotRabbitmq { }
