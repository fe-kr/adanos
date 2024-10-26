import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/auth.service';
import { ChatEvent } from './chats.enum';

@WebSocketGateway({ namespace: '/chat', cors: { origin: '*' } })
export class ChatsGateway {
  @WebSocketServer() io: Server;

  constructor(private authService: AuthService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const { accessToken, callId } = client.handshake.auth;

      if (!accessToken) {
        throw new UnauthorizedException();
      }

      if (!callId) {
        throw new NotFoundException();
      }

      const { email } = this.authService.decodeJwtToken(accessToken);
      const { peerId, name } = await this.authService.validateUser(email);

      client.data = { id: peerId, name, callId };

      client.join(callId);
    } catch (err) {
      client.emit(ChatEvent.SERVER_EXCEPTION, err);
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const { callId } = client.data;

    client.broadcast.to(callId).emit(ChatEvent.END_CHAT);
  }

  @SubscribeMessage(ChatEvent.SEND_MESSAGE)
  handleSendMessage(
    @MessageBody() { message }: { message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const date = new Date();
    const { id, name } = client.data;

    client.broadcast
      .to(client.data.callId)
      .emit(ChatEvent.SEND_MESSAGE, { id, name, message, date });
  }
}
