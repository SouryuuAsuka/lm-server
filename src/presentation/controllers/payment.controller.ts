import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Put,
  Query,
  Patch,
  Delete,
  Req,
} from '@nestjs/common';
import { PaymentsUseCases } from '@application/use-cases/payment/payment.use-cases';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@framework/nestjs/guards/auth.guard';
import RoleGuard from '@framework/nestjs/guards/role.guard';
import Role from '@domain/enums/role.enum';

@ApiTags('payments')
@Controller({
  path: 'orgs/:orgId/payments',
  version: '1',
})
export class PaymentsController {
  constructor(private paymentsUseCases: PaymentsUseCases) {}

  @UseGuards(RoleGuard(Role.Manager))
  @UseGuards(JwtAuthGuard)
  @Get()
  async getPaymentList(
    @Param('orgId') orgId: number,
    @Req() req: any,
    @Query('p') page?: number,
  ) {
    return {
      status: 'success',
      data: await this.paymentsUseCases.getPaymentList(orgId, page, req.user),
    };
  }

  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Post()
  async createPayment(@Param('orgId') orgId: number, @Body() quests: number[]) {
    await this.paymentsUseCases.createPayment(orgId, quests);
    return {
      status: 'success',
      data: {},
    };
  }

  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Delete(':payId')
  async cancelPayment(@Param('payId') payId: number) {
    await this.paymentsUseCases.cancelPayment(payId);
    return {
      status: 'success',
      data: {},
    };
  }
}
