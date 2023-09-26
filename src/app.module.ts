import { Module } from '@nestjs/common';

import {
  UsersModule,
  RequestsModule,
  PaymentsModule,
  ProductsModule,
  OrgsModule,
  CouriersModule,
  CartsModule,
  AuthModule,
} from 'src/framework/ioc';
import {
  HashModule,
  DatabaseModule,
  JwtServicesModule,
  AwsModule,
  MailModule,
  BotModule
} from '@src/application/proxy';
import { ExceptionsModule } from '@src/presentation/exceptions/exceptions.module';
import { StrategyModule } from '@src/framework/strategies/strategy.module';
import { LoggerModule } from './framework/nestjs/logger/logger.module';

@Module({
  imports: [
    AwsModule,
    ExceptionsModule,
    JwtServicesModule,
    HashModule,
    DatabaseModule,
    MailModule,
    BotModule,
    UsersModule,
    RequestsModule,
    PaymentsModule,
    ProductsModule,
    OrgsModule,
    CouriersModule,
    CartsModule,
    AuthModule,
    StrategyModule,
    LoggerModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
