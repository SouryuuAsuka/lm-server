import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any) {
    if (err) {
      return err;
    } else {
      const isAdmin = user.userRole > 4 ? true : false;
      const isAuth = true;
      return { ...user, isAdmin: isAdmin, isAuth: isAuth };
    }
  }
}

@Injectable()
export class SimpleUserGuard extends AuthGuard('simple-jwt') {
  handleRequest(err: any, user: any) {
    if (err) {
      if(err.empty){
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