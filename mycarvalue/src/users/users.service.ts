import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private repo: Repository<User>,
  ) { }

  create(email: string, password: string): Promise<User> {
    // create entity instance to be able to use hooks
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findOne(id: number = 0): Promise<User | undefined> {
    // with sqlite
    // findOne(null) returns the first entity instance
    if (!id) {
      return;
    }
    return this.repo.findOne(id);
  }

  find(email: string): Promise<User[]> {
    return this.repo.find({ email });
  }

  async update(id: number, attributes: Partial<User>): Promise<User | undefined> {
    const user = await this.findOne(id);
    if (!user) {
      return;
    }
    Object.assign(user, attributes);
    // use save(entuty) to use hooks instead of update()
    return this.repo.save(user);
  }

  async remove(id: number): Promise<User | undefined> {
    const user = await this.findOne(id);
    if (!user) {
      return;
    }
    // use remove(entuty) to use hooks instead of delete()
    return this.repo.remove(user);
  }
}
