import { Module } from '@nestjs/common';

import { UsersUseCases } from '@src/application/use-cases/user.use-case';
import { UsersController } from '@src/presentation/controllers/';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersUseCases],
})
export class UsersModule {}
