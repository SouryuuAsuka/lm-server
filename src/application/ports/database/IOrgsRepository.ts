import { Injectable } from '@nestjs/common';
import { CreateOrgDto, UpdateOrgDto } from '@src/domain/dtos/org';
@Injectable()
export abstract class IOrgsRepository {
  abstract getList(page: number, city: string, category: string): Promise<any>;
  abstract create(createOrg: CreateOrgDto, ownerId: number): Promise<any[]>;
  abstract getById(orgId: number): Promise<any[]>;
  abstract getFullById(orgId: number): Promise<any>;
  abstract edit(updateOrg: UpdateOrgDto, orgId: number): Promise<boolean>;
  abstract setPublic(orgId: number, status: boolean): Promise<boolean>;
  abstract getOwner(orgId: number): Promise<any[]>;
  abstract getQuestList(
    orgId: number,
    page: number,
    status: string,
    paid: string,
  ): Promise<any>;
}
