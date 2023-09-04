import { Module } from '@nestjs/common';
import { AuthUseCases } from '@application/use-cases/auth/auth.use-cases';
import { AuthController } from '@presentation/controllers/auth/auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { HashModule } from '@application/proxy/hash.module';
import { LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy } from '@framework/strategies/';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      signOptions: {
        expiresIn: '60d'
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthUseCases, 
    LocalStrategy, 
    AccessTokenStrategy, 
    RefreshTokenStrategy,
    HashModule,
  ],
})
export class AuthModule { }
