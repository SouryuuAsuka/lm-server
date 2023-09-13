import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IAuthRepository {
  abstract getUserPassByEmail(email: string): any;
  abstract getUserPassByUsername(username: string): any;
  abstract createRefreshToken(userId, tokenDate, tokenHash, ip);
  abstract deleteRefreshTokenById(tokenId: number);
  abstract getRefreshTokenById(userId: number);
  abstract searchRefreshToken(userId: number, date, hash);
  abstract updateRefreshTokenById(ip, tokenDate, tokenHash, tokenId);
}
