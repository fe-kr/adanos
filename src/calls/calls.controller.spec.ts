import { Test } from '@nestjs/testing';
import { Call } from 'src/common/entity';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { mockFactory } from 'src/common/test';
import { faker } from '@faker-js/faker';
import { ConfigService } from '@nestjs/config';

describe('UsersController', () => {
  let service: CallsService;
  let controller: CallsController;

  beforeEach(async () => {
    const MockedCallsService = {
      provide: CallsService,
      useValue: mockFactory(CallsService),
    };

    const module = await Test.createTestingModule({
      controllers: [CallsController],
      providers: [ConfigService, MockedCallsService],
    }).compile();

    service = module.get<CallsService>(MockedCallsService.provide);
    controller = module.get<CallsController>(CallsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user calls', async () => {
    const calls = faker.helpers.multiple(() => new Call());
    const userId = faker.string.uuid();
    const totalItems = faker.number.int(100);
    const paginationParams = {
      page: faker.number.int(100),
      limit: faker.number.int(100),
      size: faker.number.int(100),
      offset: faker.number.int(100),
    };

    jest.spyOn(service, 'findByUserId').mockReturnValue(
      Promise.resolve({
        data: calls,
        metadata: { ...paginationParams, totalPages: totalItems },
      }),
    );

    const result = await controller.getCurrentUserCalls(
      paginationParams,
      userId,
    );

    expect(service.findByUserId).toHaveBeenCalled();
    expect(result).toEqual({
      data: calls,
      metadata: { ...paginationParams, totalPages: totalItems },
    });
  });
});
