import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@src/framework/jwt/jwt.module';

@Global()
@Module({
  providers: [JwtModule],
  exports: [JwtModule],
})
export class JwtServicesModule {}
