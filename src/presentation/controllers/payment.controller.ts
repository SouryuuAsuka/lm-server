import {
  Controller,
  UseGuards,
  Get,
  Param,
  Post,
  Body,
  Query,
  Delete,
  Req,
} from '@nestjs/common';
import { PaymentsUseCases } from '@src/application/use-cases/payment.use-case';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/framework/nestjs/guards/auth.guard';
import RoleGuard from '@src/framework/nestjs/guards/role.guard';
import Role from '@src/domain/enums/role.enum';

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
