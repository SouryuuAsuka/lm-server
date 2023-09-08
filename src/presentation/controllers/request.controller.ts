import { Controller, Get, Param, UseGuards, Post, Body, Put, Query, Patch, Delete } from '@nestjs/common';
import { RequestsUseCases } from '@application/use-cases/request/request.use-cases';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, SimpleUserGuard } from '@framework/nestjs/guards/auth.guard';
import RoleGuard from '@framework/nestjs/guards/role.guard';
import Role from '@domain/enums/role.enum';
@ApiTags('requests')
@Controller({
  path: 'requests',
  version: '1',
})
export class RequestsController {
  constructor(private requestsUseCases: RequestsUseCases) { }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Moderator))
  @Get()
  async getRequestList(
    @Query('p') page: number
  ) {
    return {
      status: "success",
      data:{
        requests:  this.requestsUseCases.getRequestList(page)
      }
    }
  }

  //TODO: Дать возможность пользователям просматривать собственные заявки
  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Moderator))
  @Get(':requestId')
  async getRequest(
    @Param('requestId') requestId: number
  ) {
    return {
      status: "success",
      data: {
        request: await this.requestsUseCases.getRequest(requestId)
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Moderator))
  @Patch(':requestId/confirm')
  async confirmRequest(
    @Param('requestId') requestId: number
  ) {
    return {
      status: "success",
      data: {
        org: await this.requestsUseCases.confirmRequest(requestId)
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(RoleGuard(Role.Moderator))
  @Patch(':requestId/comment')
  async setRequestComment(
    @Param('requestId') requestId: number,
    @Body() comment: string
  ) {
    return {
      status: "success",
      data: {
        request: await this.requestsUseCases.setRequestComment(requestId, comment)
      }
    }
  }

}