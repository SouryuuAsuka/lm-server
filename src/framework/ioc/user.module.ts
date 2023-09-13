import { Module } from '@nestjs/common';

import { UsersUseCases } from '@application/use-cases/user/user.use-cases';
import { UsersController } from '@presentation/controllers/';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersUseCases],
})
export class UsersModule {}
