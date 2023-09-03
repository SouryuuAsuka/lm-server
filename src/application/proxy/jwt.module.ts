import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@framework/jwt/jwt.module';

@Global()
@Module({
  providers: [JwtModule],
  exports: [JwtModule],
})
export class JwtServicesModule {}