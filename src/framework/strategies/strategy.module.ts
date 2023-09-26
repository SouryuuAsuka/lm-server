import { PassportModule } from '@nestjs/passport';
import { Module } from '@nestjs/common';
import {
  LocalStrategy,
  AccessTokenStrategy,
  RefreshTokenStrategy,
  SimpleTokenStrategy,
} from '@src/framework/strategies/';
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