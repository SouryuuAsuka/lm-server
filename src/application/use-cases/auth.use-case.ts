import { Injectable } from '@nestjs/common';
import { IAuthRepository } from '@src/application/ports/database/IAuthRepository';
import { JwtModule } from '@src/framework/jwt/jwt.module';
import { IHashService } from '@src/application/ports/IHashService';
import { IMailService } from '@src/application/ports/IMailService';
@Injectable()
export class AuthUseCases {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtModule,
    private readonly hashService: IHashService,
    private readonly mailService: IMailService,
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
        throw new Error('Пользователь с таким Email уже существует');
      }
      const usernameSearch = await this.authRepository.getUserPassByUsername(
        user.username,
      ); //Checking if user already exists
      if (Object.keys(usernameSearch).length === 0) {
        throw new Error('Пользователь с таким Username уже существует');
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
        createdUser[0].userId,
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
    try {
      const users = await this.authRepository.searchRefreshToken(
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
          users[0].id,
          users[0].email,
          users[0].role,
        );
        const refreshToken = await this.jwtService.generateRefreshToken(
          users[0].id,
          hash,
          nowTime,
        );
        await this.authRepository.updateRefreshTokenById(
          ip,
          nowTime,
          hash,
          users[0].tokenId,
        );
        return { accessToken: accessToken, refreshToken: refreshToken };
      } else {
        throw new Error('Ошибка сервера');
      }
    } catch (err: any) {
      throw err;
    }
  }
  async signout(userId: number, refreshToken: string) {
    try {
      const tokenRow = await this.authRepository.getRefreshTokenById(userId);
      if (tokenRow.length === 0) throw new Error("Пользователь не найден");
      const nowTime = new Date();
      let tokenId = null;
      tokenRow.forEach((element: any) => {
        if (tokenId) return;
        const tokenCreated = new Date(element.created);
        const tokenTime = tokenCreated.setMonth(nowTime.getMonth() + 1);
        if (element.token == refreshToken && new Date(tokenTime).getTime() > nowTime.getTime()) {
          tokenId = element.token;
          return;
        }
      });
      if (!tokenId) throw new Error("Ошибка при верификации токена");
      await this.authRepository.deleteRefreshTokenById(tokenId);
      return true;
    } catch (err) {
      throw err;
    }
  }
}
