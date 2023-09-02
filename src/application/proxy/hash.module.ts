import { Module } from '@nestjs/common';
import { BcryptModule } from '@framework/hash/bcrypt/bcrypt.module';

@Module({
  providers: [BcryptModule],
  exports: [BcryptModule],
})
export class HashModule {}