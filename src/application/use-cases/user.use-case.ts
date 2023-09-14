import { Injectable } from '@nestjs/common';
import { IUsersRepository } from '@src/application/ports/database/IUsersRepository';

@Injectable()
export class UsersUseCases {
  constructor(private readonly usersRepository: IUsersRepository) {}
  async getUser(userId: number) {
    return this.usersRepository.getUserById(userId);
  }
  async getUserByUsername(username: string) {
    return this.usersRepository.getUserByUsername(username);
  }
  async getOrgListByUsername(
    username: string,
    page: number,
    city: string,
    category: string,
  ) {
    console.log('page 0 -' + page);
    return this.usersRepository.getOrgListByUsername(
      username,
      page,
      city,
      category,
    );
  }
}
