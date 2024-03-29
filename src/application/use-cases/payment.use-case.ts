import { Injectable } from '@nestjs/common';
import { IPaymentsRepository } from '@src/application/ports/database/IPaymentsRepository';
import { IOrgsRepository } from '@src/application/ports/database/IOrgsRepository';

@Injectable()
export class PaymentsUseCases {
  constructor(
    private readonly paymentsRepository: IPaymentsRepository,
    private readonly orgsRepository: IOrgsRepository,
  ) {}
  async getPaymentList(orgId: number, page: number, user: any) {
    if (user.isAdmin) {
      const quests = await this.paymentsRepository.getFullList(
        orgId,
        page,
      );
      return quests;
    } else {
      const owner = await this.orgsRepository.getOwner(orgId);
      if (owner == user.userId) {
        const quests = await this.paymentsRepository.getList(
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
