import { randomBytes } from "crypto";
import { Test } from "@nestjs/testing"
import { AuthService, hashLength, scrypt, separator } from "./auth.service"
import { User } from "./user.entity";
import { UsersService } from "./users.service";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";

describe('Auth service', () => {
  const email = 'test@test.com';
  const password = 'super-pass';
  let service: AuthService;
  let fakeUservice: Partial<UsersService>;

  beforeEach(async () => {
    // create fake user service
    const users: User[] = [];

    fakeUservice = {
      async find(email: string) {
        return users.filter(u => u.email === email)
      },
      async create(email: string, hashedPassword: string) {
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password: hashedPassword
        } as User;
        users.push(user);
        return user;
      },
    }
    // create a DI container
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        // reroute DI 
        {
          provide: UsersService,
          useValue: fakeUservice
        }
      ]
    }).compile();

    service = module.get(AuthService);
  })

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  })

  it('can signup a user with a salted and hashed password', async () => {
    const user = await service.signup(email, password);

    expect(user.email).toBe(email);
    expect(user.password).not.toEqual(password);

    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  })

  it('throws an error if user signs up with pre-existing email', async () => {
    await service.signup(email, password);
    const userPromise = service.signup(email, password);
    await expect(userPromise).rejects.toThrow(BadRequestException)
  })

  it('throws when signing in with unused email', async () => {
    const userPromise = service.signin(email, password);
    await expect(userPromise).rejects.toThrow(UnauthorizedException);
  })

  it('throws when signing in with invalid password', async () => {
    await service.signup(email, password);
    const userPromise = service.signin(email, 'wrong pass');
    await expect(userPromise).rejects.toThrow(UnauthorizedException);
  })

  it('provides user when signing in with correct password', async () => {
    await service.signup(email, password);
    const user = await service.signin(email, password);
    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
  })

})
