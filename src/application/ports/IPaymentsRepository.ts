import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IPaymentsRepository {
  abstract getUserPassByEmail(email: string): any
  abstract getUserPassByUsername(username: string): any
}