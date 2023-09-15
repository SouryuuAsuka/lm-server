import { Module, Global } from '@nestjs/common';
import { ClientBotRabbitmq } from '@src/framework/bot/client/rabbitmq/clientBotRabbitmq.module';
import { TechBotRabbitmq } from '@src/framework/bot/tech/rabbitmq/techBotRabbitmq.module';
import { DeliveryBotRabbitmq } from '@src/framework/bot/delivery/rabbitmq/deliveryBotRabbitmq.module';
@Global()
@Module({
  imports: [ClientBotRabbitmq, TechBotRabbitmq, DeliveryBotRabbitmq],
  exports: [ClientBotRabbitmq, TechBotRabbitmq, DeliveryBotRabbitmq],
})
export class BotModule { }
