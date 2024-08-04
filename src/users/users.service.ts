import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entity/user.entity';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  create(userParams: CreateUserDto) {
    const newUser = this.usersRepository.create(userParams);

    return this.usersRepository.save(newUser);
  }

  async update(id: string, userParams: UpdateUserDto) {
    await this.usersRepository.update({ id }, userParams);

    return this.usersRepository.findOneBy({ id });
  }

  delete(id: string) {
    return this.usersRepository.delete({ id });
  }
}
