import { Global, Module } from '@nestjs/common';
import { LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy, SimpleTokenStrategy } from './';
@Global()
@Module({
  providers: [
    AccessTokenStrategy, LocalStrategy, RefreshTokenStrategy, SimpleTokenStrategy
  ],
  exports: [
    AccessTokenStrategy, LocalStrategy, RefreshTokenStrategy, SimpleTokenStrategy
  ]
})
export class StrategyModule {}
