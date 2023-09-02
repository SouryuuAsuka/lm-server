import { Injectable } from '@nestjs/common';
import { IPaymentsRepository } from '@application/ports/IPaymentsRepository';


@Injectable()
export class PaymentsUseCases {
  constructor(private readonly paymentsRepository: IPaymentsRepository) {}
  async getPaymentList(orgId:number, page: number){
  }
  async createPayment(orgId:number, page: number[]){
  }
  async cancelPayment(payId:number){
  }
}