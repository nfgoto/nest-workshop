import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { Serialize } from '../interceptors/serialize.interceptor';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService
  ) { }

  // @Get('/whoami')
  // async whoami(@Session() session: { userId: number }) {
  //   if (!session.userId) {
  //     throw new NotFoundException('no signed in user,');
  //   }
  //   return this.usersService.findOne(session.userId);
  // }

  @UseGuards(AuthGuard)
  @Get('/whoami')
  whoami(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signout')
  async signout(@Session() session: { userId: number | null }) {
    session.userId = null;
  }

  @Post('/signup')
  async createUser(@Body() { email, password }: CreateUserDto, @Session() session: { userId: number }) {
    const user = await this.authService.signup(email, password);
    session.userId = user.id;
    return user;
  }

  @Post('/signin')
  async signinUser(@Body() { email, password }: CreateUserDto, @Session() session: { userId: number }) {
    const user = await this.authService.signin(email, password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException(`user #${id} not found`)
    }
    return user;
  }

  @Get()
  async findAllUsers(@Query('email') email: string) {
    const users = await this.usersService.find(email);
    if (!users.length) {
      throw new NotFoundException(`no users with email ${email}`)
    }
    return users;
  }

  @Patch('/:id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.usersService.update(parseInt(id), body);
    if (!user) {
      throw new NotFoundException(`user #${id} not found`)
    }
    return user;
  }

  @Delete('/:id')
  async removeUser(@Param('id') id: string) {
    const user = await this.usersService.remove(parseInt(id));
    if (!user) {
      throw new NotFoundException(`user #${id} not found`)
    }
    return user;
  }
}
