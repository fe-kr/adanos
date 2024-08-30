import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Call, User } from 'src/common/entity';
import { faker } from '@faker-js/faker';
import { mockFactory } from 'src/common/test';

import { Repository } from 'typeorm';
import { CallsService } from './calls.service';
import { ConfigService } from '@nestjs/config';

describe('CallsService', () => {
  let service: CallsService;
  let repository: Repository<Call>;
  let usersRepository: Repository<User>;

  beforeEach(async () => {
    const CallsRepository = {
      provide: getRepositoryToken(Call),
      useValue: mockFactory(Repository),
    };

    const UsersRepository = {
      provide: getRepositoryToken(User),
      useValue: mockFactory(Repository),
    };

    const module = await Test.createTestingModule({
      providers: [
        CallsService,
        UsersRepository,
        ConfigService,
        CallsRepository,
      ],
    }).compile();

    service = module.get<CallsService>(CallsService);
    repository = module.get<Repository<Call>>(CallsRepository.provide);
    usersRepository = module.get<Repository<User>>(UsersRepository.provide);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return user calls', async () => {
    const userId = faker.string.uuid();
    const calls = faker.helpers.multiple(() => new Call());
    const totalItems = faker.number.int(100);
    const paginationParams = {
      page: faker.number.int(100),
      limit: faker.number.int(100),
      size: faker.number.int(100),
      offset: faker.number.int(100),
    };

    jest
      .spyOn(repository, 'findAndCount')
      .mockResolvedValue(Promise.resolve([calls, totalItems]));

    const totalPages = Math.ceil(totalItems / paginationParams.limit);
    const result = await service.findByUserId(userId, paginationParams);

    expect(repository.findAndCount).toHaveBeenCalled();

    expect(result).toEqual({
      data: calls,
      metadata: { ...paginationParams, totalPages },
    });
  });

  it('should create a call', async () => {
    const call = new Call();
    const user = new User();

    call.id = faker.string.uuid();

    const createCallParams = {
      senderId: faker.string.uuid(),
      receiverId: faker.string.uuid(),
    };

    jest.spyOn(repository, 'save').mockResolvedValue(call);
    jest.spyOn(usersRepository, 'findOneBy').mockResolvedValue(user);

    expect(await service.create(createCallParams)).toEqual(call);
    expect(repository.create).toHaveBeenCalledWith({
      ...createCallParams,
      sender: user,
      receiver: user,
    });
  });

  it('should update and return a call', async () => {
    const call = new Call();
    call.id = faker.string.uuid();

    const endedAt = faker.date.recent();

    jest.spyOn(repository, 'findOneBy').mockResolvedValue(call);

    const result = await service.update(call.id, { endedAt });

    expect(repository.update).toHaveBeenCalledWith(
      { id: call.id },
      { endedAt },
    );

    expect(result.endedAt).toEqual(call.endedAt);
  });
});
