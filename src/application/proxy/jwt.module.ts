import { Module } from '@nestjs/common';
import { JwtModule } from '@framework/jwt/jwt.module';

@Module({
  providers: [JwtModule],
  exports: [JwtModule],
})
export class JwtServicesModule {}