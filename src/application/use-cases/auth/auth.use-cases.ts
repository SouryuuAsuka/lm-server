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
    console.log("hash - "+hash);
    console.log("user.password - "+user.password);
    if (hash !== user.password) {
      throw new Error('Login error');
    }
    return user;
  }
  async signin(user: any, ip: string) {
    const tokenHash = await this.bcryptModule.generateHash(8);
    const tokenDate = new Date();
    await this.authRepository.createRefreshToken(user.userId, tokenDate, tokenHash, ip);
    const accessToken = await this.jwtService.generateAccessToken(user.userId, user.email, user.userRole);
    const refreshToken = await this.jwtService.generateRefreshToken(user.userId, tokenHash, tokenDate);
    let profileLink: string;
    if (user.username !== '') {
      profileLink = user.username;
    } else {
      profileLink = "id" + user.userId;
    }
    return { accessToken: accessToken, refreshToken: refreshToken, profileLink: profileLink }
  }
  async signup(user) {

  }
  async refreshToken() {

  }
  async signout() {

  }
}