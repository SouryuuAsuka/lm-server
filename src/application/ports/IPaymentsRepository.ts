import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IPaymentsRepository {
  abstract cancelPayment(orgId: number, paymentId: number): any;
  abstract getPaymentList(orgId: number, page: number): any;
  abstract getFullPaymentList(orgId: number, page: number): any;
  abstract setPaidQuests(quests): any;
  abstract updatePaymentsById(orgId: number, userId: number, quests, sum): any;
}
