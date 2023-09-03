import { Controller, Get, Param, Post, Body, Put, Query, Patch, Delete } from '@nestjs/common';
import { CouriersUseCases } from '@application/use-cases/courier/courier.use-cases';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('couriers')
@Controller({
  path: 'couriers',
  version: '1',
})
export class CouriersController {
  constructor(private couriersUseCases: CouriersUseCases) {}

  @Get()
  async getCourierList(
  ) {
    return this.couriersUseCases.getCourierList();
  }

  @Put(':tgId/confirm')
  async confirmCourier(
    @Param('tgId') tgId: number,
  ) {
    return this.couriersUseCases.confirmCourier(tgId);
    //TODO: add dbot
  }
}