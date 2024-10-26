import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Call, User } from 'src/common/entity';
import { Repository } from 'typeorm';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';
import { IPagination, PaginatedResponse } from 'src/common/decorator';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call) private callsRepository: Repository<Call>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findByUserId(
    userId: string,
    paginationParams: IPagination,
  ): Promise<PaginatedResponse<Call>> {
    const { limit, offset } = paginationParams;
    const [data, totalItems] = await this.callsRepository.findAndCount({
      where: [{ sender: { id: userId } }, { receiver: { id: userId } }],
      relations: ['sender', 'receiver'],
      select: {
        sender: { id: true, name: true },
        receiver: { id: true, name: true },
      },
      take: limit,
      skip: offset,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return { data, metadata: { ...paginationParams, totalPages } };
  }

  async create(callParams: CreateCallDto) {
    const { senderId, receiverId } = callParams;
    const sender = await this.usersRepository.findOneBy({ peerId: senderId });
    const receiver = await this.usersRepository.findOneBy({
      peerId: receiverId,
    });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    const newCall = this.callsRepository.create({
      ...callParams,
      sender,
      receiver,
    });

    return this.callsRepository.save(newCall);
  }

  async update(id: string, callParams: UpdateCallDto) {
    await this.callsRepository.update({ id }, callParams);

    return this.callsRepository.findOneBy({ id });
  }
}
