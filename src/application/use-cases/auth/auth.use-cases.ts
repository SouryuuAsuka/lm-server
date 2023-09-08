import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '@application/ports/IAuthRepository';
import { JwtModule } from '@framework/jwt/jwt.module';
import { BcryptModule } from '@framework/hash/bcrypt/bcrypt.module';

@Injectable()
export class AuthUseCases {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtModule,
    private readonly bcryptModule: BcryptModule,
  ) { }

  async validateUser(login: string, password: string, type: string) {
    let user: any;
    if (type === 'email') {
      user = await this.authRepository.getUserPassByEmail(login);
    } else if (type === 'username') {
      user = await this.authRepository.getUserPassByUsername(login);
    } else {
      throw new Error('Login type error');
    }
    const hash = await this.bcryptModule.getPasswordHash(password, user.passSalt)
    if (hash !== user.password) {
      throw new Error('Login error');
    }
    return user;
  }
  async signin(user: any, ip: string) {
    const tokenHash = await this.bcryptModule.generateHash(8);
    const tokenDate = new Date();
    await this.authRepository.createRefreshToken(user.id, tokenDate, tokenHash, ip);
    const accessToken = await this.jwtService.generateAccessToken(user.id, user.email, user.role);
    const refreshToken = await this.jwtService.generateRefreshToken(user.id, tokenHash, tokenDate);
    let profileLink: string;
    if (user.username !== '') {
      profileLink = user.username;
    } else {
      profileLink = "id" + user.id;
    }
    return { accessToken: accessToken, refreshToken: refreshToken, profileLink: profileLink }
  }
  async signup(user: any) {

  }
  async refreshToken(decoded: any, ip: any) {
    const user = await this.authRepository.searchRefreshToken(decoded.id, decoded.date, decoded.hash);
    const nowTime = new Date();
    const tokenCreated = new Date(decoded.date);
    const tokenTime = tokenCreated.setMonth(nowTime.getMonth()+1);
    if (new Date(tokenTime).getTime() > nowTime.getTime()) {
      const hash = await this.bcryptModule.generateHash(8);
      const accessToken = await this.jwtService.generateAccessToken(user.id, user.email, user.rle);
      const refreshToken = await this.jwtService.generateRefreshToken(user.id, hash, nowTime);
      await this.authRepository.updateRefreshTokenById(ip, nowTime, hash, user.tokenId);
      return { accessToken: accessToken, refreshToken: refreshToken };
    } else {
      throw "Ошибка сервера"
    }
  }
  async signout() {

  }
}