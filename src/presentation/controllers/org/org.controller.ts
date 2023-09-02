import { Controller, Get, Param, Post, Body, Put, Query, Patch, Delete } from '@nestjs/common';
import { OrgsUseCases } from '@application/use-cases/org/org.use-cases';
import { CreateOrgDto, UpdateOrgDto } from '@domain/dtos/org';
@Controller('orgs')
export class OrgsController {
  constructor(private orgsUseCases: OrgsUseCases) { }

  @Get()
  async getOrgList(
    @Query('p') page: number,
    @Query('c') city: string,
    @Query('t') category: string,
  ) {
    return this.orgsUseCases.getOrgList(page, city, category);
  }

  @Post()
  async createOrg(
    @Body() createOrg: CreateOrgDto
  ) {
    const ownerId = 0; //TODO: add getting UserID
    return this.orgsUseCases.createOrg(createOrg, ownerId);
  }

  @Get(':orgId')
  async getOrgById(
    @Param('orgId') orgId: number
  ) {
    return this.orgsUseCases.getOrgById(orgId);
  }

  @Patch(':orgId')
  async editOrg(
    @Param('orgId') orgId: number,
    @Body() updateOrg: UpdateOrgDto
  ) {
    return this.orgsUseCases.editOrg(orgId, updateOrg);
  }

  @Patch(':orgId/public')
  async setPublic(
    @Param('orgId') orgId: number,
    @Body('public') status: boolean
  ) {
    return this.orgsUseCases.setPublic(orgId, status);
  }

  @Get('/:orgId/quests')
  async getOrgQuestList(
    @Param('orgId') orgId: number,
    @Query('page') page: number,
    @Query('status') status: string,
    @Query('paid') paid: string
  ) {
    return this.orgsUseCases.getOrgQuestList(true, 0, orgId, page, status, paid);
  }


}