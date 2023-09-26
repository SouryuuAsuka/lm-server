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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
