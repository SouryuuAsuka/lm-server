import { Injectable } from '@nestjs/common';
import { CreateOrgDto, UpdateOrgDto } from '@domain/dtos/org';
@Injectable()
export abstract class IOrgsRepository {
  abstract getOrgList(page: number, city: string, category: string): any
  abstract createOrg(createOrg: CreateOrgDto, ownerId: number): any
  abstract getOrgById(orgId: number): any
  abstract getFullOrgById(orgId: number): any
  abstract editOrg(updateOrg: UpdateOrgDto, orgId: number): any
  abstract setPublic(orgId: number, status: boolean): any
  abstract getOwner(orgId: number): any
  abstract getOrgQuestList(orgId: number, page:number, status: string, paid: string): any
}