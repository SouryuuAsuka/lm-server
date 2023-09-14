import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

class EmptyTokenError extends Error {
  empty: boolean;
  constructor(message: string) {
    super(message);
    this.empty = true;
  }
}

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        AccessTokenStrategy.extractJWTFromCookie,
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_KEY_SECRET,
    });
  }

  private static extractJWTFromCookie(request: any): string | null {
    if (request.cookies && request.cookies.accessToken) {
      return request.cookies.accessToken;
    }
  }

  validate(payload: AccessTokenStrategy) {
    return payload;
  }
}
