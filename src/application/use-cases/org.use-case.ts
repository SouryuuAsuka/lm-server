import { Injectable } from '@nestjs/common';
import { IOrgsRepository } from '@src/application/ports/database/IOrgsRepository';
import { CreateOrgDto, UpdateOrgDto } from '@src/domain/dtos/org';
import { IAwsService } from '@src/application/ports/IAwsService';
import { MemoryStorageFile } from '@blazity/nest-file-fastify';

@Injectable()
export class OrgsUseCases {
  constructor(
    private readonly orgsRepository: IOrgsRepository,
    private readonly awsRepository: IAwsService,
    ) {}

  async getOrgList(
    page: number = 1,
    city: string = '%',
    category: string = '0, 1, 2',
  ) {
    return await this.orgsRepository.getList(page, city, category);
  }
  async createOrg(createOrg: CreateOrgDto, ownerId: number, file: MemoryStorageFile) {
    const orgs = await this.orgsRepository.create(createOrg, ownerId);
    await this.awsRepository.savePicture(file, orgs[0].orgId, 'avatars-org-request');
    return 
  }
  async getOrgById(orgId: number, user: any) {
    let fullAccess = false;
    if (user.role >= 5) fullAccess = true;
    else if (user.role === 3 || user.role === 4) {
      const owner = await this.orgsRepository.getOwner(orgId);
      if (owner[0].owner == user.id) {
        fullAccess = true;
      }
    }
    if (fullAccess) {
      return await this.orgsRepository.getFullById(orgId);
    } else {
      return await this.orgsRepository.getById(orgId);
    }
  }
  async editOrg(orgId: number, updateOrg: UpdateOrgDto) {
    return await this.orgsRepository.edit(updateOrg, orgId);
  }
  async setPublic(orgId: number, status: boolean) {
    return await this.orgsRepository.setPublic(orgId, status);
  }
  async getOrgQuestList(
    isAdmin: boolean,
    userId: number,
    orgId: number,
    page: number,
    status: string,
    paid: string,
  ) {
    let fullAccess = false;
    if (isAdmin) {
      fullAccess = true;
    } else {
      const owner = await this.orgsRepository.getOwner(orgId);
      if (owner[0].owner == userId) fullAccess = true;
    }
    if (fullAccess) {
      const quests = await this.orgsRepository.getQuestList(
        orgId,
        page,
        status,
        paid,
      );
      return quests;
    } else {
      throw { error: 'Огранизация не найдена' };
    }
  }
}
