import { Module } from '@nestjs/common';

import { UsersUseCases } from '@src/application/use-cases/user/user.use-cases';
import { UsersController } from '@src/presentation/controllers/';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [UsersUseCases],
})
export class UsersModule {}
