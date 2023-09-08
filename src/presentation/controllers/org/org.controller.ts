import { Controller, Get, UseGuards, Param, Post, Body, Put, Query, Patch, Req, Res } from '@nestjs/common';
import { OrgsUseCases } from '@application/use-cases/org/org.use-cases';
import { CreateOrgDto, UpdateOrgDto } from '@domain/dtos/org';

import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard, SimpleUserGuard, RefreshTokenGuard } from '@framework/nestjs/guards/auth.guards';

@ApiTags('orgs')
@Controller({
  path: 'orgs',
  version: '1',
})
export class OrgsController {
  constructor(private orgsUseCases: OrgsUseCases) { }

  @ApiQuery({ name: 'p', required: false, type: Number })
  @ApiQuery({ name: 'c', required: false, type: String })
  @ApiQuery({ name: 't', required: false, type: String })
  @Get()
  async getOrgList(
    @Query('p') page?: number,
    @Query('c') city?: string,
    @Query('t') category?: string,
  ) {
    return {
      status: "success",
      data: {
        orgs: await this.orgsUseCases.getOrgList(page, city, category)
      }
    }
    
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createOrg(
    @Body() createOrg: CreateOrgDto,
    @Req() req: any,
  ) {
    return await this.orgsUseCases.createOrg(createOrg, req.user.userId);
  }

  @UseGuards(SimpleUserGuard)
  @Get(':orgId')
  async getOrgById(
    @Param('orgId') orgId: number,
    @Req() req: any,
  ) {
    return {
      status: "success",
      data: {
        orgs: await this.orgsUseCases.getOrgById(orgId, req.user)
      }
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':orgId')
  async editOrg(
    @Param('orgId') orgId: number,
    @Body() updateOrg: UpdateOrgDto
  ) {
    await this.orgsUseCases.editOrg(orgId, updateOrg);
    return {
      status: "success",
      data: {}
    }
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':orgId/public')
  async setPublic(
    @Param('orgId') orgId: number,
    @Body('public') status: boolean
  ) {
    await this.orgsUseCases.setPublic(orgId, status);
    return {
      status: "success",
      data: {}
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:orgId/quests')
  async getOrgQuestList(
    @Param('orgId') orgId: number,
    @Query('page') page?: number,
    @Query('status') status?: string,
    @Query('paid') paid?: string
  ) {
    return {
      status: "success",
      data: {
        quests: await this.orgsUseCases.getOrgQuestList(true, 0, orgId, page, status, paid)
      }
    }
  }


}