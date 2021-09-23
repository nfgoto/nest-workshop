import { CanActivate, ExecutionContext, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { UsersService } from "../users/users.service";

export class AdminGuard implements CanActivate {
  constructor(private usersService: UsersService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { currentUser } = context.switchToHttp().getRequest();
    return currentUser?.admin
  }
}