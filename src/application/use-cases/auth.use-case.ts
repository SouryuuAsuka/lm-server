import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '@application/ports/database/IAuthRepository';
import { JwtModule } from '@framework/jwt/jwt.module';
import { IHashService } from '@application/ports/IHashService';
import { IMailService } from '@application/ports/IMailService';
@Injectable()
export class AuthUseCases {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtModule,
    private readonly hashService: IHashService,
    private readonly mailService: IMailService,
  ) {}

  async validateUser(login: string, password: string, type: string) {
    let user: any;
    if (type === 'email') {
      user = await this.authRepository.getUserPassByEmail(login);
    } else if (type === 'username') {
      user = await this.authRepository.getUserPassByUsername(login);
    } else {
      throw new Error('Login type error');
    }
    const hash = await this.hashService.getPasswordHash(
      password,
      user.passSalt,
    );
    if (hash !== user.password) {
      throw new Error('Login error');
    }
    return user;
  }
  async signin(user: any, ip: string) {
    const tokenHash = await this.hashService.generateHash(8);
    const tokenDate = new Date();
    await this.authRepository.createRefreshToken(
      user.id,
      tokenDate,
      tokenHash,
      ip,
    );
    const accessToken = await this.jwtService.generateAccessToken(
      user.id,
      user.email,
      user.role,
    );
    const refreshToken = await this.jwtService.generateRefreshToken(
      user.id,
      tokenHash,
      tokenDate,
    );
    let profileLink: string;
    if (user.username !== '') {
      profileLink = user.username;
    } else {
      profileLink = 'id' + user.id;
    }
    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
      profileLink: profileLink,
    };
  }
  async signup(user: any) {
    try {
      const emailSearch = await this.authRepository.getUserPassByEmail(
        user.email,
      ); //Checking if user already exists
      if (Object.keys(emailSearch).length === 0) {
        throw 'Пользователь с таким Email уже существует';
      }
      const usernameSearch = await this.authRepository.getUserPassByUsername(
        user.username,
      ); //Checking if user already exists
      if (Object.keys(usernameSearch).length === 0) {
        throw 'Пользователь с таким Username уже существует';
      }
      const salt = await this.hashService.generateSalt(10);
      const hash = await this.hashService.getPasswordHash(user.password, salt);
      const createdUser = await this.authRepository.createUser(
        user.username,
        user.email,
        hash,
        salt,
      );
      const mailKey = await this.hashService.generateHash(16);
      const mailToken = await this.hashService.generateHash(16);
      const mailKeyHash = this.hashService.getMailHash(mailKey);
      await this.authRepository.createMailToken(
        createdUser.userId,
        mailToken,
        mailKeyHash,
      );
      const link =
        'https://lampymarket.com/confirmemail?t=' + mailToken + '&k=' + mailKey;
      await this.mailService.sendUserConfirmation(user.email, link);
      return true;
    } catch (err: any) {
      throw err;
    }
  }
  async refreshToken(decoded: any, ip: string) {
    const user = await this.authRepository.searchRefreshToken(
      decoded.id,
      decoded.date,
      decoded.hash,
    );
    const nowTime = new Date();
    const tokenCreated = new Date(decoded.date);
    const tokenTime = tokenCreated.setMonth(nowTime.getMonth() + 1);
    if (new Date(tokenTime).getTime() > nowTime.getTime()) {
      const hash = await this.hashService.generateHash(8);
      const accessToken = await this.jwtService.generateAccessToken(
        user.id,
        user.email,
        user.role,
      );
      const refreshToken = await this.jwtService.generateRefreshToken(
        user.id,
        hash,
        nowTime,
      );
      await this.authRepository.updateRefreshTokenById(
        ip,
        nowTime,
        hash,
        user.tokenId,
      );
      return { accessToken: accessToken, refreshToken: refreshToken };
    } else {
      throw 'Ошибка сервера';
    }
  }
  async signout() {}
}
