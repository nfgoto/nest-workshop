import { randomBytes, scrypt as _scrypt, timingSafeEqual } from "crypto";
import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { promisify } from "util";
import { User } from "./user.entity";

export const scrypt = promisify(_scrypt);
export const separator = '.';
export const hashLength = 32;


@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) { }

  async signup(email: string, password: string): Promise<User> {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException("Email already used.")
    }

    // generate salt
    const salt = randomBytes(16);

    // hash password with salt
    const hash = (await scrypt(
      Buffer.from(password),
      Buffer.from(salt),
      hashLength)) as Buffer;

    // concatenate hash with salt
    const saltedHash = `${salt.toString('hex')}${separator}${hash.toString("hex")}`;

    const user = await this.usersService.create(email, saltedHash);
    return user;
  }

  async signin(email: string, password: string): Promise<User> {
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }
    const [salt, storedHash] = user.password.split(separator);

    const hash = (await scrypt(
      Buffer.from(password, 'utf-8'),
      Buffer.from(salt, 'hex'),
      hashLength
    )) as Buffer;

    if (!timingSafeEqual(Buffer.from(storedHash, 'hex'), hash)) {
      throw new UnauthorizedException("Invalid email or password");
    }
    return user;
  }


}