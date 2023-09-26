import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IPaymentsRepository {
  abstract cancel(orgId: number, paymentId: number): Promise<boolean>;
  abstract getList(orgId: number, page: number): Promise<any[]>;
  abstract getFullList(orgId: number, page: number): Promise<any[]>;
  abstract setPaidQuests(quests): Promise<any[]>;
  abstract create(orgId: number, userId: number, quests, sum): Promise<boolean>;
}
