import { Module } from '@nestjs/common';
import { MyLogger } from './logger.service';

@Module({
  providers: [MyLogger],
})
export class LoggerModule {}