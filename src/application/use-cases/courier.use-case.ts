import { Injectable } from '@nestjs/common';
import { ICouriersRepository } from '@src/application/ports/database/ICouriersRepository';

@Injectable()
export class CouriersUseCases {
  constructor(private readonly couriersRepository: ICouriersRepository) {}
  async getCourierList() {
    return await this.couriersRepository.getCourierList();
  }
  async confirmCourier(tgId: number) {
    return await this.couriersRepository.confirmCourier(tgId);
  }
}
