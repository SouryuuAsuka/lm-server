import { Controller, Get, Param, Post, Body, Put, Query, Patch, Delete } from '@nestjs/common';
import { RequestsUseCases } from '@application/use-cases/request/request.use-cases';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('requests')
@Controller({
  path: 'requests',
  version: '1',
})
export class RequestsController {
  constructor(private requestsUseCases: RequestsUseCases) {}

  @Get()
  async getRequestList(
    @Query('p') page: number
  ) {
    return this.requestsUseCases.getRequestList(page);
  }

  @Get(':requestId')
  async getRequest(
    @Param('requestId') requestId: number
  ) {
    return this.requestsUseCases.getRequest(requestId);
  }

  @Patch(':requestId/confirm')
  async confirmRequest(
    @Param('requestId') requestId: number
  ) {
    return this.requestsUseCases.confirmRequest(requestId);
  }

  @Patch(':requestId/comment')
  async setRequestComment(
    @Param('requestId') requestId: number,
    @Body() comment: string
  ) {
    return this.requestsUseCases.setRequestComment(requestId, comment);
  }

}