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
} from '@application/proxy';
import { ExceptionsModule } from '@presentation/exceptions/exceptions.module';

@Module({
  imports: [
    AwsModule,
    ExceptionsModule,
    JwtServicesModule,
    HashModule,
    DatabaseModule,
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
