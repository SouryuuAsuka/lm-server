import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DeliveryBotRabbitmqService } from './deliveryBotRabbitmq.service';
import { IDeliveryBotTransporter } from '@src/application/ports/IDeliveryBotTransporter';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'DELIVERY_BOT',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://lm-rabbitmq:5672'],
          queue: 'dbot',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
  ],
  providers: [{ provide: IDeliveryBotTransporter, useClass: DeliveryBotRabbitmqService }],
  exports: [IDeliveryBotTransporter],
})
export class DeliveryBotRabbitmq { }
