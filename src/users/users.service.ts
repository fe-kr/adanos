import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entity';
import { Repository } from 'typeorm';
import { unlink } from 'fs';
import { basename, join } from 'node:path';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/common/config';

@Injectable()
export class UsersService {
  constructor(
    private configService: ConfigService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  private getAvatarUrl(pathToFile: string) {
    const { port, serveStaticRoot } = this.configService.get<AppConfig>('app');
    const filename = basename(pathToFile);

    const fileUrl = new URL('http:localhost');
    fileUrl.port = port.toString();
    fileUrl.pathname = `${serveStaticRoot}/${filename}`;

    return fileUrl.href;
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOneByEmail(email: string) {
    return this.usersRepository.findOneBy({ email });
  }

  async create(userParams: CreateUserDto) {
    const newUser = this.usersRepository.create(userParams);

    return this.usersRepository.save(newUser);
  }

  async update(id: string, userParams: UpdateUserDto) {
    await this.usersRepository.update({ id }, userParams);

    return this.usersRepository.findOneBy({ id });
  }

  async activate(id: string) {
    await this.usersRepository.update({ id }, { inactive: false });

    return this.usersRepository.findOneBy({ id });
  }

  async uploadAvatar(id: string, pathToFile: string) {
    const { serveStaticRoot } = this.configService.get<AppConfig>('app');
    const user = await this.usersRepository.findOneBy({ id });
    const avatarUrl = this.getAvatarUrl(pathToFile);

    await this.usersRepository.update({ id }, { avatarUrl });

    if (user.avatarUrl) {
      const filename = basename(user.avatarUrl);

      unlink(join(serveStaticRoot, filename), () => {});
    }

    return avatarUrl;
  }

  delete(id: string) {
    return this.usersRepository.delete({ id });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  deleteInactive() {
    return this.usersRepository.delete({ inactive: true });
  }
}
