import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  let email = 'test@test.com';
  let password = '5vy4v6y5y.v5t4y5y5y4y45';
  let id = 23;

  beforeEach(async () => {
    fakeUserService = {
      async find(email: string) {
        return [{ id, email, password } as User];
      },
      async findOne(id: number) {
        return { id, email, password } as User;
      },
      async create(email: string, hashedPassword: string) {
        return { id, email, password: hashedPassword } as User;
      },
      async update(id: number, attr: Partial<User>) {
        return { id, email, password } as User;
      },
      async remove(id: number) {
        return { id, email, password } as User;
      }
    };
    fakeAuthService = {
      async signup(email: string, password: string) {
        return {} as User;
      },
      async signin(email: string, password: string) {
        return { id, email, password } as User;
      }
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should find all users', async () => {
    const users = await controller.findAllUsers(email);
    expect(users.length).toBe(1);
  });

  it('should find a user', async () => {
    const user = await controller.findUser(`${id}`);
    expect(user.id).toBe(id);
  });

  it('should throw an error when user find a user', async () => {
    fakeUserService.findOne = async () => undefined;
    const userPromise = controller.findUser(`${id}`);
    await expect(userPromise).rejects.toThrow(NotFoundException);
  });

  it('should update a users', async () => {
    const user = await controller.updateUser(`${id}`, {} as User);
    expect(user.id).toBe(id);
  });

  it('should sign in a users', async () => {
    const session: { userId: number; } = { userId: -1 };
    const user = await controller.signinUser({ email, password: 'pass' }, session);
    expect(user.id).toBe(id);
    expect(session.userId).toBe(id);
  });
});
