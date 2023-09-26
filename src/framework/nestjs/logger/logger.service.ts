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

  error(error: Error): void {
    this.logger.error(error.message);
  }
  log(error: Error): void {
    this.logger.log(error.message);
  }
  warn(error: Error): void {
    this.logger.warn(error.message);
  }
}
