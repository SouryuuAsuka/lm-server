import { Module } from '@nestjs/common';
import { IHashService } from '@src/application/ports/IHashService';
import { BcryptService } from './bcrypt.service';

@Module({
  providers: [{ provide: IHashService, useClass: BcryptService }],
  exports: [IHashService],
})
export class BcryptModule {}
