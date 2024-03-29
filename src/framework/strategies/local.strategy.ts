import { AuthUseCases } from '@src/application/use-cases/auth.use-case';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import validator from 'validator';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authUseCases: AuthUseCases) {
    super({
      usernameField: 'login',
    });
  }

  async validate(login: string, password: string): Promise<any> {
    let type: string;
    if (validator.isEmail(login)) {
      type = 'email';
    } else {
      type = 'username';
    }

    const user = await this.authUseCases.validateUser(login, password, type);
    if (!user) {
      throw new UnauthorizedException({
        message: 'You have entered a wrong username or password',
      });
    }
    return user;
  }
}
