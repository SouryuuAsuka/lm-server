import { Module } from '@nestjs/common';
import {
  AuthRepository,
  CartsRepository,
  CouriersRepository,
  OrgsRepository,
  PaymentsRepository,
  RequestsRepository,
  UsersRepository,
  ProductsRepository,
} from '@framework/database/postgresql/repository';
import { Pool } from 'pg';
import { IAuthRepository } from '@application/ports/IAuthRepository';
import { ICartsRepository } from '@application/ports/ICartsRepository';
import { ICouriersRepository } from '@application/ports/ICouriersRepository';
import { IOrgsRepository } from '@application/ports/IOrgsRepository';
import { IPaymentsRepository } from '@application/ports/IPaymentsRepository';
import { IRequestsRepository } from '@application/ports/IRequestsRepository';
import { IUsersRepository } from '@application/ports/IUsersRepository';
import { IProductsRepository } from '@application/ports/IProductsRepository';

const databasePoolFactory = async () => {
  return new Pool({
    user: process.env.POSTGRESQL_USER,
    database: process.env.POSTGRESQL_DATABASE,
    password: process.env.POSTGRESQL_PASSWORD,
    port: 5432,
    host: '172.17.0.1',
  });
};
@Module({
  providers: [
    {
      provide: 'DATABASE_POOL',
      useFactory: databasePoolFactory,
    },
    { provide: IAuthRepository, useClass: AuthRepository },
    { provide: ICartsRepository, useClass: CartsRepository },
    { provide: ICouriersRepository, useClass: CouriersRepository },
    { provide: IOrgsRepository, useClass: OrgsRepository },
    { provide: IProductsRepository, useClass: ProductsRepository },
    { provide: IPaymentsRepository, useClass: PaymentsRepository },
    { provide: IRequestsRepository, useClass: RequestsRepository },
    { provide: IUsersRepository, useClass: UsersRepository },
  ],
  exports: [
    IAuthRepository,
    ICartsRepository,
    ICouriersRepository,
    IOrgsRepository,
    IProductsRepository,
    IPaymentsRepository,
    IRequestsRepository,
    IUsersRepository,
  ],
})
export class PostgresqlDatabaseModule {}
