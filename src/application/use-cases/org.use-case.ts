import { Injectable } from '@nestjs/common';
import { IOrgsRepository } from '@src/application/ports/database/IOrgsRepository';
import { CreateOrgDto, UpdateOrgDto } from '@src/domain/dtos/org';

@Injectable()
export class OrgsUseCases {
  constructor(private readonly orgsRepository: IOrgsRepository) {}

  async getOrgList(
    page: number = 1,
    city: string = '%',
    category: string = '0, 1, 2',
  ) {
    return await this.orgsRepository.getOrgList(page, city, category);
  }
  async createOrg(createOrg: CreateOrgDto, ownerId: number) {
    return await this.orgsRepository.createOrg(createOrg, ownerId);
  }
  async getOrgById(orgId: number, user: any) {
    let fullAccess = false;
    if (user.role >= 5) fullAccess = true;
    else if (user.role === 3 || user.role === 4) {
      const owner = await this.orgsRepository.getOwner(orgId);
      if (owner === user.id) {
        fullAccess = true;
      }
    }
    if (fullAccess) {
      return await this.orgsRepository.getFullOrgById(orgId);
    } else {
      return await this.orgsRepository.getOrgById(orgId);
    }
  }
  async editOrg(orgId: number, updateOrg: UpdateOrgDto) {
    return await this.orgsRepository.editOrg(updateOrg, orgId);
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
      if (owner == userId) fullAccess = true;
    }
    if (fullAccess) {
      const quests = await this.orgsRepository.getOrgQuestList(
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
