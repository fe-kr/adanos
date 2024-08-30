import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from 'src/common/entity';
import { faker } from '@faker-js/faker';
import { mockFactory } from 'src/common/test';

import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { ConfigService } from '@nestjs/config';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const UsersRepository = {
      provide: getRepositoryToken(User),
      useValue: mockFactory(Repository),
    };

    const module = await Test.createTestingModule({
      providers: [UsersService, ConfigService, UsersRepository],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(UsersRepository.provide);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find a single user by email', async () => {
    const user = new User();

    user.email = faker.internet.email();

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

    const result = await service.findOneByEmail(user.email);

    expect(repository.findOneBy).toHaveBeenCalledWith({ email: user.email });

    expect(result).toEqual(user);
  });

  it('should return an array of users', async () => {
    const users = faker.helpers.multiple(() => new User());

    jest.spyOn(repository, 'find').mockResolvedValue(users);

    const result = await service.findAll();

    expect(repository.find).toHaveBeenCalled();

    expect(result).toEqual(users);
  });

  it('should create a user', async () => {
    const user = new User();

    user.name = faker.internet.userName();
    user.email = faker.internet.email();

    jest.spyOn(repository, 'save').mockResolvedValue(user);

    expect(await service.create(user)).toEqual(user);
  });

  it('should update and return a user', async () => {
    const user = new User();
    user.id = faker.string.uuid();

    const name = faker.internet.userName();
    user.name = name;

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(user);

    const result = await service.update(user.id, { name });

    expect(repository.update).toHaveBeenCalledWith({ id: user.id }, { name });

    expect(result.name).toEqual(user.name);
  });

  it('should delete a user', async () => {
    const user = new User();
    user.id = faker.string.uuid();

    jest.spyOn(repository, 'delete').mockResolvedValue(null);

    await service.delete(user.id);

    expect(repository.delete).toHaveBeenCalledWith({ id: user.id });
  });
});
