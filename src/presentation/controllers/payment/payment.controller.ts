import { Controller, Get, Param, Post, Body, Put, Query, Patch, Delete } from '@nestjs/common';
import { PaymentsUseCases } from '@application/use-cases/payment/payment.use-cases';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('payments')
@Controller({
  path: 'orgs/:orgId/payments',
  version: '1',
})
export class PaymentsController {
  constructor(private paymentsUseCases: PaymentsUseCases) { }

  @Get()
  async getPaymentList(
    @Param('orgId') orgId: number,
    @Query('p') page?: number
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