import { Injectable } from '@nestjs/common';
import { RequestType } from '@src/domain/entities';

@Injectable()
export abstract class IRequestsRepository {
  abstract getRequestList(page: number): Promise<RequestType[]>;
  abstract getRequestById(requestId: number): Promise<RequestType[]>;
  abstract confirmRequest(requestId: number): Promise<any[]>;
  abstract setRequestComment(requestId: number, comment: string): Promise<boolean>;
}
