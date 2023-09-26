import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IUsersRepository {
  abstract updateUserRole(owner: number, role: number): Promise<boolean>;
  abstract getById(userId: number): Promise<any>;
  abstract getByUsername(username: string): Promise<any>;
  abstract getOrgListByUsername(
    username: string,
    page: number,
    city: string,
    category: string,
  ): Promise<any>;
  abstract getMailConfirm(mailToken:string, mailKey:string): Promise<any[]>
  abstract deleteMailConfirm(userId:number): Promise<boolean>;
}
