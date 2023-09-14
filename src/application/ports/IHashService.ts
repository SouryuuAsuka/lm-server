import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IHashService {
  abstract getPasswordHash(password: string, passSalt: string): any;
  abstract getMailHash(mailKey: string): any;
  abstract generateHash(length: number): any;
  abstract generateSalt(length: number): any;
}
