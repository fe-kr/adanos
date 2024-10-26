import { Test } from '@nestjs/testing';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from 'src/common/entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { mockFactory } from 'src/common/test';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';

describe('UsersController', () => {
  let service: UsersService;
  let controller: UsersController;

  beforeEach(async () => {
    const MockedUsersService = {
      provide: UsersService,
      useValue: mockFactory(UsersService),
    };

    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [ConfigService, MockedUsersService],
    }).compile();

    service = module.get<UsersService>(MockedUsersService.provide);
    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a new user', async () => {
    const createUserDto: CreateUserDto = {
      name: faker.internet.userName(),
      email: faker.internet.email(),
    };

    const user = new User();

    jest.spyOn(service, 'create').mockReturnValue(Promise.resolve(user));

    const result = await controller.createUser(createUserDto);

    expect(service.create).toHaveBeenCalledWith(createUserDto);
    expect(result).toEqual(user);
  });

  it('should return an array of users', async () => {
    const users = faker.helpers.multiple(() => new User());

    jest.spyOn(service, 'findAll').mockReturnValue(Promise.resolve(users));

    const result = await controller.getUsers();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual(users);
  });

  it('should find a user and update', async () => {
    const updateUserDto: UpdateUserDto = {
      name: faker.internet.userName(),
    };

    const user = new User();
    user.id = faker.string.uuid();

    jest.spyOn(service, 'update').mockReturnValue(Promise.resolve(user));

    const result = await controller.updateUser(user.id, updateUserDto);

    expect(service.update).toHaveBeenCalledWith(user.id, updateUserDto);
    expect(result).toEqual(user);
  });

  it('should delete a user', async () => {
    const user = new User();
    user.id = faker.string.uuid();

    jest.spyOn(service, 'delete').mockReturnValue(null);

    await controller.deleteUserById(user.id);
    expect(service.delete).toHaveBeenCalledWith(user.id);
  });
});
