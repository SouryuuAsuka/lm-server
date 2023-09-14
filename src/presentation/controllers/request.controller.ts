import {
  Controller,
  Get,
  Param,
  UseGuards,
  Body,
  Query,
  Patch,
} from '@nestjs/common';
import { RequestsUseCases } from '@application/use-cases/request.use-case';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@framework/nestjs/guards/auth.guard';
import RoleGuard from '@framework/nestjs/guards/role.guard';
import Role from '@domain/enums/role.enum';
@ApiTags('requests')
@Controller({
  path: 'requests',
  version: '1',
})
export class RequestsController {
  constructor(private requestsUseCases: RequestsUseCases) {}

  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Get()
  async getRequestList(@Query('p') page: number) {
    return {
      status: 'success',
      data: {
        requests: this.requestsUseCases.getRequestList(page),
      },
    };
  }

  //TODO: Дать возможность пользователям просматривать собственные заявки
  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Get(':requestId')
  async getRequest(@Param('requestId') requestId: number) {
    return {
      status: 'success',
      data: {
        request: await this.requestsUseCases.getRequest(requestId),
      },
    };
  }

  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Patch(':requestId/confirm')
  async confirmRequest(@Param('requestId') requestId: number) {
    return {
      status: 'success',
      data: {
        org: await this.requestsUseCases.confirmRequest(requestId),
      },
    };
  }

  @UseGuards(RoleGuard(Role.Moderator))
  @UseGuards(JwtAuthGuard)
  @Patch(':requestId/comment')
  async setRequestComment(
    @Param('requestId') requestId: number,
    @Body() comment: string,
  ) {
    return {
      status: 'success',
      data: {
        request: await this.requestsUseCases.setRequestComment(
          requestId,
          comment,
        ),
      },
    };
  }
}
