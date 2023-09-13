import { Injectable } from '@nestjs/common';
import { IException } from '@domain/interfaces/exception.interface';
import { DatabaseException } from './database.exception';

@Injectable()
export class ExceptionsService implements IException {
  DatabaseException(message: string = 'Ошибка базы данных'): void {
    throw new DatabaseException(message);
  }
}
