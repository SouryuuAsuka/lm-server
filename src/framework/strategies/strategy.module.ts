import { PassportModule } from '@nestjs/passport';
import { Module, Global } from '@nestjs/common';
import {
  LocalStrategy,
  AccessTokenStrategy,
  RefreshTokenStrategy,
  SimpleTokenStrategy,
} from '@src/framework/strategies/';
@Global()
@Module({
  providers: [
    LocalStrategy,
    AccessTokenStrategy,
    SimpleTokenStrategy,
    RefreshTokenStrategy,
  ],
  imports: [
    PassportModule,
  ],
  exports: [
    PassportModule,
  ]
})
export class StrategyModule {}