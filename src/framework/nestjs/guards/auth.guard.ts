import {
  Injectable,
  ForbiddenException,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info, context: ExecutionContext) {
    if (err || !user) {
      const request = context.switchToHttp().getRequest();
      if (request.cookies && request.cookies.accessToken) {
        throw err || new UnauthorizedException();
      } else {
        throw new ForbiddenException();
      }
    } else {
      const isAdmin = user.role > 4 ? true : false;
      const isAuth = true;
      return { ...user, isAdmin: isAdmin, isAuth: isAuth };
    }
  }
}

@Injectable()
export class SimpleUserGuard extends AuthGuard('simple-jwt') {
  handleRequest(err: any, user: any, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (err || !user) {
      if (!request.cookies.accessToken) {
        return {
          id: null,
          role: 0,
          email: null,
          isAdmin: false,
          isAuth: false,
        };
      } else throw err || new UnauthorizedException();
    } else {
      const isAdmin = user.role > 4 ? true : false;
      const isAuth = true;
      return { ...user, isAdmin: isAdmin, isAuth: isAuth };
    }
  }
}
@Injectable()
export class RefreshTokenGuard extends AuthGuard('jwt-refresh') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new ForbiddenException();
    }
    return user;
  }
}

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw new ForbiddenException();
    }
    return user;
  }
}
