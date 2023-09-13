import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  UseGuards,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { CouriersUseCases } from '@application/use-cases/courier/courier.use-cases';
import { ApiTags } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  SimpleUserGuard,
} from '@framework/nestjs/guards/auth.guard';
import RoleGuard from '@framework/nestjs/guards/role.guard';
import Role from '@domain/enums/role.enum';
@ApiTags('couriers')
@Controller({
  path: 'couriers',
  version: '1',
})
export class CouriersController {
  constructor(private couriersUseCases: CouriersUseCases) {}

  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Get()
  async getCourierList() {
    return {
      status: 'success',
      data: await this.couriersUseCases.getCourierList(),
    };
  }

  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Put(':tgId/confirm')
  async confirmCourier(@Param('tgId') tgId: number) {
    return {
      status: 'success',
      data: await this.couriersUseCases.confirmCourier(tgId),
    };
    //TODO: add dbot
  }
}
