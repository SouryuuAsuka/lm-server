import { Injectable } from '@nestjs/common';
import { CreateOrgDto, UpdateOrgDto } from '@src/domain/dtos/org';
@Injectable()
export abstract class IOrgsRepository {
  abstract getList(page: number, city: string, category: string): any;
  abstract create(createOrg: CreateOrgDto, ownerId: number): any;
  abstract getById(orgId: number): Promise<any[]>;
  abstract getFullById(orgId: number): any;
  abstract edit(updateOrg: UpdateOrgDto, orgId: number): any;
  abstract setPublic(orgId: number, status: boolean): any;
  abstract getOwner(orgId: number): any;
  abstract getQuestList(
    orgId: number,
    page: number,
    status: string,
    paid: string,
  ): any;
}
