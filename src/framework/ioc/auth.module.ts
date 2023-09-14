import { Module } from '@nestjs/common';
import { AuthUseCases } from '@src/application/use-cases/auth.use-case';
import { AuthController } from '@src/presentation/controllers/';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '60d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthUseCases,
  ],
})
export class AuthModule {}
