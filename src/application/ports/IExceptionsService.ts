import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IExceptionsService {
  abstract DatabaseException(message: string): any;
}
