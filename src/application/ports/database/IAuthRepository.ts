import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IAuthRepository {
  abstract getUserPassByEmail(email: string): Promise<any[]>;
  abstract getUserPassByUsername(username: string): Promise<any[]>;
  abstract createRefreshToken(userId, tokenDate, tokenHash, ip): Promise<boolean>;
  abstract deleteRefreshTokenById(tokenId: number): Promise<boolean>;
  abstract getRefreshTokenById(userId: number): Promise<any[]>;
  abstract searchRefreshToken(userId: number, date, hash): Promise<any[]>;
  abstract updateRefreshTokenById(ip, tokenDate, tokenHash, tokenId): Promise<boolean>;
  abstract createUser(username, email, hash, salt): Promise<any[]>;
  abstract createMailToken(userId, mailToken, mailKeyHash): Promise<boolean>;
}
