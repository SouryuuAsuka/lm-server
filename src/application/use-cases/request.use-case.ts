import { Injectable } from '@nestjs/common';
import { IRequestsRepository } from '@src/application/ports/database/IRequestsRepository';
import { IUsersRepository } from '@src/application/ports/database/IUsersRepository';
import { ITechBotTransporter } from '../ports/ITechBotTransporter';
@Injectable()
export class RequestsUseCases {
  constructor(
    private readonly requestsRepository: IRequestsRepository,
    private readonly usersRepository: IUsersRepository,
    private readonly techBotTransporter: ITechBotTransporter,
  ) {}
  async getRequestList(page: number) {
    return await this.requestsRepository.getRequestList(page);
  }
  async getRequest(requestId: number) {
    const requests = await this.requestsRepository.getRequestById(requestId);
    return requests[0];
  }
  async confirmRequest(requestId: number) {
    const orgs = await this.requestsRepository.confirmRequest(requestId);
    return this.usersRepository.updateUserRole(orgs[0].owner, 3);
  }
  async setRequestComment(requestId: number, comment: string) {
    await this.requestsRepository.setRequestComment(requestId, comment);
    const request = await this.requestsRepository.getRequestById(requestId)
    await this.techBotTransporter.sendMessage(request[0].appId, comment)
    return true
  }
}
