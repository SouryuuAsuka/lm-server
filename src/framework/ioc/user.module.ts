import { Module } from '@nestjs/common';

import { IUsersRepository } from '@application/ports/IUsersRepository';
import { UsersUseCases } from '@application/use-cases/user/user.use-cases';
import { UsersRepository } from '@framework/database/postgresql/repository/UsersRepository';
import { UsersController } from '@presentation/controllers/user/user.controller';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersUseCases,
    { provide: IUsersRepository, useClass: UsersRepository },
  ],
})
export class UsersModule {}