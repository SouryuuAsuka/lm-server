import { Injectable } from '@nestjs/common';
import { ICouriersRepository } from '@src/application/ports/database/ICouriersRepository';

@Injectable()
export class CouriersUseCases {
  constructor(private readonly couriersRepository: ICouriersRepository) {}
  async getCourierList() {
    const response =  await this.couriersRepository.getList()
    console.log("response = "+JSON.stringify(response))
    return response;
  }
  async confirmCourier(tgId: number) {
    return await this.couriersRepository.confirm(tgId);
  }
}
