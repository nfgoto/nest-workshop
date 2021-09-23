import { NestMiddleware } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NextFunction, Request, Response } from "express";
import { User } from "../user.entity";
import { UsersService } from "../users.service";

// module definition augmentation
// will add an optional property on Express Request type definition
declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

export class CurrentUserMiddleware implements NestMiddleware {
  constructor(@InjectRepository(User) private usersService: UsersService) { }

  async use(req: Request, res: Response, next: NextFunction) {
    const session = req.session;
    if (session?.userId) {
      const user = await this.usersService.findOne(session.userId);
      req.currentUser = user;
    }

    return next();
  }
}