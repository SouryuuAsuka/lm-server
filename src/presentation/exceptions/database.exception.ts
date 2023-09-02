import { HttpStatus, HttpException } from "@nestjs/common";

export class DatabaseException extends HttpException {
  constructor(message: string) {
    super('DatabaseError: '+message, HttpStatus.INTERNAL_SERVER_ERROR);

  }
}