import { Injectable, ForbiddenException, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, info, context: ExecutionContext) {
    if (err) {
      const request = context.switchToHttp().getRequest();
      if (request.cookies && request.cookies.accessToken) {
        return err;
      } else {
        throw new ForbiddenException()
      }
    } else {
      const isAdmin = user.userRole > 4 ? true : false;
      const isAuth = true;
      return { ...user, isAdmin: isAdmin, isAuth: isAuth };
    }
  }
}

@Injectable()
export class SimpleUserGuard extends AuthGuard('simple-jwt') {
  handleRequest(err: any, user: any, info, context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (err) {
      if (request.cookies && request.cookies.accessToken) {
        return {
          userId: null,
          userRole: 0,
          email: null,
          isAdmin: false,
          isAuth: false
        };
      } else return err

    } else {
      const isAdmin = user.userRole > 4 ? true : false;
      const isAuth = true;
      return { ...user, isAdmin: isAdmin, isAuth: isAuth };
    }
  }
}

export class RefreshTokenGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err) {
      throw new ForbiddenException()
    }
    return err;
  }
}