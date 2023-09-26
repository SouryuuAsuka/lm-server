import { Module } from '@nestjs/common';
import { LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy, SimpleTokenStrategy } from './';
@Module({
  providers: [
    LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy, SimpleTokenStrategy
  ],
  exports:[
    LocalStrategy, AccessTokenStrategy, RefreshTokenStrategy, SimpleTokenStrategy
  ]
})
export class StrategyModule {}
