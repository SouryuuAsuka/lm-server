import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IUsersRepository {
  abstract updateUserRole(owner: number, role: number): any
  abstract getUserById(userId: number): any
  abstract getUserByUsername(username: string): any
  abstract getOrgListByUsername(username: string, page: number, city:string, category:string): any
}