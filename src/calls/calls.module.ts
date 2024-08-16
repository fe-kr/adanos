import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Call, User } from 'src/common/entity';
import { CallsController } from './calls.controller';
import { CallsService } from './calls.service';
import { CallsGateway } from './calls.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Call, User])],
  controllers: [CallsController],
  providers: [CallsService, CallsGateway],
  exports: [CallsService],
})
export class CallsModule {}
