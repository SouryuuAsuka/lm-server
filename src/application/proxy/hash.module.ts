import { Global, Module } from '@nestjs/common';
import { BcryptModule } from '@framework/hash/bcrypt/bcrypt.module';

@Global()
@Module({
  providers: [BcryptModule],
  exports: [BcryptModule],
})
export class HashModule {}
