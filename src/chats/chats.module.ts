import { Module } from '@nestjs/common';
import { ChatsGateway } from './chats.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [ChatsGateway],
})
export class ChatsModule {}
