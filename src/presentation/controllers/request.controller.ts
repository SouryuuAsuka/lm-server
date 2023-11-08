import {
  Controller,
  Get,
  Param,
  UseGuards,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { RequestsUseCases } from '@src/application/use-cases/request.use-case';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@src/framework/nestjs/guards/auth.guard';
import RoleGuard from '@src/framework/nestjs/guards/role.guard';
import Role from '@src/domain/enums/role.enum';
@ApiTags('requests')
@Controller({
  path: 'requests',
  version: '1',
})
export class RequestsController {
  constructor(private requestsUseCases: RequestsUseCases) { }

  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Get()
  async getRequestList(@Query('p') page: number) {
    const requests = await this.requestsUseCases.getRequestList(page);
    return {
      status: 'success',
      data: {
        requests: requests,
      },
    };
  }

  //TODO: Дать возможность пользователям просматривать собственные заявки
  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Get(':requestId')
  async getRequest(@Param('requestId') requestId: number) {
    const request = await this.requestsUseCases.getRequest(requestId)
    return {
      status: 'success',
      data: {
        request: request,
      },
    };
  }

  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Patch(':requestId/confirm')
  async confirmRequest(@Param('requestId') requestId: number) {
    const org = await this.requestsUseCases.confirmRequest(requestId);
    return {
      status: 'success',
      data: {
        org: org
      },
    };
  }

  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Patch(':requestId/comment')
  async setRequestComment(
    @Param('requestId') requestId: number,
    @Body('comment') comment: string,
  ) {
    const requests = await this.requestsUseCases.setRequestComment(requestId, comment)
    return {
      status: 'success',
      data: {
        requests: requests
      },
    };
  }
}
