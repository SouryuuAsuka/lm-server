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
    return await this.requestsRepository.getRequestById(requestId);
  }
  async confirmRequest(requestId: number) {
    const org = await this.requestsRepository.confirmRequest(requestId);
    return this.usersRepository.updateUserRole(org.owner, 3);
  }
  async setRequestComment(requestId: number, comment: string) {
    const request = await this.requestsRepository.setRequestComment(requestId, comment);
    await this.techBotTransporter.sendMessage(requestId, comment)
    return true
  }
}
