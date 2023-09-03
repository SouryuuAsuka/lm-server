import { Module } from '@nestjs/common';

import { UsersUseCases } from '@application/use-cases/user/user.use-cases';
import { UsersController } from '@presentation/controllers/user/user.controller';

@Module({
  imports: [],
  controllers: [UsersController],
  providers: [
    UsersUseCases,
  ],
})
export class UsersModule {}