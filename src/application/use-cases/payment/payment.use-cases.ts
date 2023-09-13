import { Injectable } from '@nestjs/common';
import { IPaymentsRepository } from '@application/ports/IPaymentsRepository';
import { IOrgsRepository } from '@application/ports/IOrgsRepository';

@Injectable()
export class PaymentsUseCases {
  constructor(
    private readonly paymentsRepository: IPaymentsRepository,
    private readonly orgsRepository: IOrgsRepository,
  ) {}
  async getPaymentList(orgId: number, page: number, user: any) {
    if (user.isAdmin) {
      const quests = await this.paymentsRepository.getFullPaymentList(
        orgId,
        page,
      );
      return quests;
    } else {
      const owner = await this.orgsRepository.getOwner(orgId);
      if (owner == user.userId) {
        const quests = await this.paymentsRepository.getPaymentList(
          orgId,
          page,
        );
        return quests;
      } else {
        throw { error: 'Ошибка доступа' };
      }
    }
  }
  async createPayment(orgId: number, page: number[]) {}
  async cancelPayment(payId: number) {}
}
