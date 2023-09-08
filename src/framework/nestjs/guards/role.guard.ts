
import Role  from '@domain/enums/role.enum';
import { CanActivate, ExecutionContext, mixin, Type } from '@nestjs/common';
import RequestWithUser from '@domain/interfaces/requestWithUser.interface';

const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(context: ExecutionContext) {
      const request = context.switchToHttp().getRequest<RequestWithUser>();
      const user = request.user;

      return user.role >= role;
    }
  }

  return mixin(RoleGuardMixin);
}

export default RoleGuard;