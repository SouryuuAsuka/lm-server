import {
  Controller,
  Get,
  UseGuards,
  Param,
  Post,
  Body,
  Query,
  Patch,
  Req,
  UseInterceptors,
} from '@nestjs/common';
import { OrgsUseCases } from '@src/application/use-cases/org.use-case';
import { CreateOrgDto, UpdateOrgDto } from '@src/domain/dtos/org';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  JwtAuthGuard,
  SimpleUserGuard,
} from '@src/framework/nestjs/guards/auth.guard';
import RoleGuard from '@src/framework/nestjs/guards/role.guard';
import Role from '@src/domain/enums/role.enum';
import { UploadGuard } from '@src/framework/nestjs/guards/upload.guard';
import { File } from '@src/framework/nestjs/decorators/file.decorator';
import { MultipartFile } from "@fastify/multipart"
import { FastifyRequest } from "fastify";
import { FileInterceptor, UploadedFile, MemoryStorageFile } from '@blazity/nest-file-fastify';

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
      status: 'success',
      data: await this.orgsUseCases.getOrgList(page, city, category),
    };
  }
  @UseGuards(RoleGuard(Role.User))
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createOrg(
    @UploadedFile() file: MemoryStorageFile,
    @Body() createOrg: CreateOrgDto,
    @Req() req: FastifyRequest,
  ) {
    console.log("createOrg - " + JSON.stringify(createOrg))
    await this.orgsUseCases.createOrg(createOrg, req.user.id, file);
    return {
      status: 'success',
      data: {},
    };
  }

  @UseGuards(SimpleUserGuard)
  @Get(':orgId')
  async getOrgById(@Param('orgId') orgId: number, @Req() req: any) {
    const org = await this.orgsUseCases.getOrgById(orgId, req.user)
    return {
      status: 'success',
      data: {
        org
      },
    };
  }

  @UseGuards(RoleGuard(Role.Manager))
  @UseGuards(JwtAuthGuard)
  @Patch(':orgId')
  async editOrg(
    @Param('orgId') orgId: number,
    @Body() updateOrg: UpdateOrgDto,
  ) {
    await this.orgsUseCases.editOrg(orgId, updateOrg);
    return {
      status: 'success',
      data: {},
    };
  }

  @UseGuards(RoleGuard(Role.Manager))
  @UseGuards(JwtAuthGuard)
  @Patch(':orgId/public')
  async setPublic(
    @Param('orgId') orgId: number,
    @Body('public') status: boolean,
  ) {
    await this.orgsUseCases.setPublic(orgId, status);
    return {
      status: 'success',
      data: {},
    };
  }

  @UseGuards(RoleGuard(Role.Manager))
  @UseGuards(JwtAuthGuard)
  @Get('/:orgId/quests')
  async getOrgQuestList(
    @Param('orgId') orgId: number,
    @Query('page') page?: number,
    @Query('status') status?: string,
    @Query('paid') paid?: string,
  ) {
    return {
      status: 'success',
      data: {
        quests: await this.orgsUseCases.getOrgQuestList(
          true,
          0,
          orgId,
          page,
          status,
          paid,
        ),
      },
    };
  }
}
