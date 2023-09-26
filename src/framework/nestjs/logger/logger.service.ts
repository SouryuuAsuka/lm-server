import { Injectable, LoggerService } from "@nestjs/common";
import { format, transports } from 'winston';
import { WinstonModule, utilities as nestWinstonModuleUtilities } from 'nest-winston';
const DEBUG = false;

@Injectable()
export class MyLogger implements LoggerService {
  private logger: LoggerService;

  constructor() {
    const logFormat = format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    });
    const consoleFormat = format.combine(
      format.timestamp(),
      format.ms(),
      nestWinstonModuleUtilities.format.nestLike('LampyMarket.server', {
        colors: true,
        prettyPrint: true,
      }),
    );
    this.logger = WinstonModule.createLogger({
      level: DEBUG ? 'debug' : 'info',

      format: format.combine(
        format.timestamp(),
        logFormat,
      ),
      transports: [new transports.Console({ format: consoleFormat })],

    });
  }

  error(error: any): void {
    this.logger.error(error);
  }
  log(error: any): void {
    this.logger.log(error);
  }
  warn(error: any): void {
    this.logger.warn(error);
  }
}
