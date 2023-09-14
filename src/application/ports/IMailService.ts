import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IMailService {
  abstract sendUserConfirmation(email: string, link: string): any;
}
