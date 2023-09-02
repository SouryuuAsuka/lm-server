import { Module } from '@nestjs/common';
import { 
  AuthRepository, 
  CartsRepository, 
  CouriersRepository, 
  OrgsRepository, 
  PaymentsRepository, 
  RequestsRepository, 
  UsersRepository,
} from '@framework/database/postgresql/repository';
import { Pool } from 'pg';

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
    AuthRepository, 
    CartsRepository, 
    CouriersRepository, 
    OrgsRepository, 
    PaymentsRepository, 
    RequestsRepository, 
    UsersRepository,
  ],
  exports: [
    AuthRepository, 
    CartsRepository, 
    CouriersRepository, 
    OrgsRepository, 
    PaymentsRepository, 
    RequestsRepository, 
    UsersRepository,
  ],
})
export class PostgresqlDatabaseModule { }