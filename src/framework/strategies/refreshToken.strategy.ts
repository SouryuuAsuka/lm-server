import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.REFRESH_KEY_SECRET,
      passReqToCallback: true,
    });
  }

  private static extractJWTFromCookie(request: any): string | null {
    if (request.cookies && request.cookies.refreshToken) {
      return request.cookies.refreshToken;
    }
    return null;
  }

  validate(payload: any) {
    return payload;
  }
}