import { Controller, Get, Param, Post, Body, Put, Query, Patch, Delete } from '@nestjs/common';
import { PaymentsUseCases } from '@application/use-cases/payment/payment.use-cases';

@Controller('orgs/:orgId/payments')
export class PaymentsController {
  constructor(private paymentsUseCases: PaymentsUseCases) { }

  @Get()
  async getPaymentList(
    @Param('orgId') orgId: number,
    @Query('p') page: number
  ) {
    return this.paymentsUseCases.getPaymentList(orgId, page);
  }

  @Post()
  async createPayment(
    @Param('orgId') orgId: number,
    @Body() quests: number[]
  ) {
    return this.paymentsUseCases.createPayment(orgId, quests);
  }

  @Delete(':payId')
  async cancelPayment(
    @Param('payId') payId: number
  ) {
    return this.paymentsUseCases.cancelPayment(payId);
  }
}