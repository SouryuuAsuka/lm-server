import { AuthUseCases } from '@application/use-cases/auth/auth.use-cases';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import validator from 'validator';


@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authUseCases: AuthUseCases) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    let type: string;
    if (validator.isEmail(username)) {
      type = 'email';
    } else {
      type = 'username';
    }
    const user = await this.authUseCases.validateUser(username, password, type);
    if (!user) {
      throw new UnauthorizedException({
        message: "You have entered a wrong username or password"
      });
    }
    return user;
  }
}