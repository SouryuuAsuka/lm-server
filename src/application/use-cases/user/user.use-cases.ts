import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '@application/ports/IUsersRepository';


@Injectable()
export class UsersUseCases {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async getUser(userId: number){
    return this.usersRepository.getUserById(userId);
  }
  async getUserByUsername(username: string){
    return this.usersRepository.getUserByUsername(username);
  }
  async getOrgListByUsername(username: string, page: number, city:string, category:string){
    return this.usersRepository.getOrgListByUsername(username, page, city, category);
  }

}