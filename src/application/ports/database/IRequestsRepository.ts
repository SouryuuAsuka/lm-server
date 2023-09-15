import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IRequestsRepository {
  abstract getRequestList(page: number): any;
  abstract getRequestById(requestId: number): any;
  abstract confirmRequest(requestId: number): any;
  abstract setRequestComment(requestId: number, comment: string): any;
}
