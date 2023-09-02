export interface IFormatExceptionMessage {
  message: string;
  code_error?: number;
}

export interface IException {
  DatabaseException(message?: string): void;
}