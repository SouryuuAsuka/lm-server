import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IRequestsRepository {
  abstract getRequestList(page: number): Promise<any[]>;
  abstract getRequestById(requestId: number): Promise<any[]>;
  abstract confirmRequest(requestId: number): Promise<any[]>;
  abstract setRequestComment(requestId: number, comment: string): Promise<any[]>;
}
