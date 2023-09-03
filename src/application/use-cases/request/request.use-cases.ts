import { Injectable } from '@nestjs/common';
import { IRequestsRepository } from '@application/ports/IRequestsRepository';
import { IUsersRepository } from '@application/ports/IUsersRepository';

@Injectable()
export class RequestsUseCases {
  constructor(
    private readonly requestsRepository: IRequestsRepository,
    private readonly usersRepository: IUsersRepository
    ) { }
  async getRequestList(page: number) {
    return await this.requestsRepository.getRequestList(page);
  }
  async getRequest(requestId: number) {
    return await this.requestsRepository.getRequestById(requestId);

  }
  async confirmRequest(requestId: number) {
    const org = await this.requestsRepository.confirmRequest(requestId);
    await this.usersRepository.updateUserRole(org.owner, 3);
  }
  async setRequestComment(requestId: number, comment: string) {

  }
}