import { Injectable,  Req, } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

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

  private static extractJWTFromCookie( request: any): string | null {
    if (request.cookies && request.cookies.accessToken) {
      return request.cookies.accessToken;
    }
    return null;
  }

  validate(payload: any) {
    console.log("payload "+ JSON.stringify(payload));

    return payload;
  }
}
