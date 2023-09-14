import { Global, Module } from '@nestjs/common';
import { BcryptModule } from '@src/framework/hash/bcrypt/bcrypt.module';

@Global()
@Module({
  imports: [BcryptModule],
  exports: [BcryptModule],
})
export class HashModule {}
