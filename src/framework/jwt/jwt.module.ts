import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class JwtModule {
  constructor(
    private jwtService: JwtService,
  ) { }
  async generateAccessToken(userId, email, userRole) {
    try {
      const accessToken = this.jwtService.sign(
        {
          userId: userId,
          email: email,
          userRole: userRole
        },
        {
          secret: process.env.ACCESS_KEY_SECRET,
          expiresIn: '5m'
        }
      );
      return accessToken;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async generateRefreshToken(userId, tokenHash, tokenDate) {
    try {
      const refreshToken = this.jwtService.sign(
        {
          userId: userId,
          date: tokenDate,
          hash: tokenHash
        },
        {
          secret: process.env.REFRESH_KEY_SECRET,
          expiresIn: '30d'
        }
      );
      return refreshToken;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  async verifyRefreshToken(token) {
    try {
      return await this.jwtService.verify(token, {publicKey: process.env.REFRESH_KEY_SECRET});
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}