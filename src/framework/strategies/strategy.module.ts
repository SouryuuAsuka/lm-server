import { PassportModule } from '@nestjs/passport';
import { Module, Global } from '@nestjs/common';
import {
  AccessTokenStrategy,
  RefreshTokenStrategy,
  SimpleTokenStrategy,
} from '@src/framework/strategies/';
@Global()
@Module({
  providers: [
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