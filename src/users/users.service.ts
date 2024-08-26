import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entity';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FilesService } from 'src/files/files.service';

@Injectable()
export class UsersService {
  constructor(
    private filesService: FilesService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  findAll() {
    return this.usersRepository.find();
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async create(userParams: CreateUserDto) {
    const newUser = this.usersRepository.create(userParams);

    try {
      const user = await this.usersRepository.save(newUser);

      return user;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id: string, userParams: UpdateUserDto) {
    await this.usersRepository.update({ id }, userParams);

    return this.usersRepository.findOneBy({ id });
  }

  async activate(id: string) {
    await this.usersRepository.update({ id }, { inactive: false });

    return this.usersRepository.findOneBy({ id });
  }

  async uploadAvatar(id: string, image: Express.Multer.File) {
    const [pathToFile, { avatar }] = await Promise.all([
      this.filesService.uploadImage(id, image),
      this.usersRepository.findOneBy({ id }),
    ]);

    await this.usersRepository.update({ id }, { avatar: pathToFile });

    // this.filesService.deleteFile(avatar);

    return pathToFile;
  }

  delete(id: string) {
    return this.usersRepository.delete({ id });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  deleteInactive() {
    return this.usersRepository.delete({ inactive: true });
  }
}
