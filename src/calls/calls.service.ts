import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Call } from 'src/common/entity';
import { Repository } from 'typeorm';
import { CreateCallDto } from './dto/create-call.dto';
import { UpdateCallDto } from './dto/update-call.dto';

@Injectable()
export class CallsService {
  constructor(
    @InjectRepository(Call) private callsRepository: Repository<Call>,
  ) {}

  findByReceiverId(receiverId: string) {
    return this.callsRepository.findBy({ receiverId });
  }

  create(callParams: CreateCallDto) {
    const newCall = this.callsRepository.create(callParams);

    return this.callsRepository.save(newCall);
  }

  async update(id: string, callParams: UpdateCallDto) {
    await this.callsRepository.update({ id }, callParams);

    return this.callsRepository.findOneBy({ id });
  }
}
