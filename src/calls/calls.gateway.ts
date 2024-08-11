import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { CallsService } from './calls.service';
import { nanoid } from 'nanoid';

const CallEvent = {
  SEND_CALL_INVITE: 'SEND_CALL_INVITE',
  RECEIVE_CALL_INVITE: 'RECEIVE_CALL_INVITE',

  ACCEPT_CALL_INVITE: 'ACCEPT_CALL_INVITE',
  DECLINE_CALL_INVITE: 'DECLINE_CALL_INVITE',

  START_CALL: 'START_CALL',
  END_CALL: 'END_CALL',
};

@WebSocketGateway()
export class CallsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io: Server;

  constructor(
    // private jwtService: JwtService,
    private callsService: CallsService,
  ) {}

  handleConnection(@ConnectedSocket() client: Socket) {
    // const { token } = client.handshake.auth;
    // const { id, name } = this.jwtService.decode(token);

    client.data = {
      id: Math.random().toString(),
      name: Math.random().toString(),
    };
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const { roomId } = client.data;

    client.broadcast.to(roomId).emit(CallEvent.END_CALL);
  }

  @SubscribeMessage(CallEvent.SEND_CALL_INVITE)
  handleSendCallInvite(
    @MessageBody() peerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const { id, name } = client.data;

    this.io
      .to(peerId)
      .emit(CallEvent.RECEIVE_CALL_INVITE, { peerId: id, name });
  }

  @SubscribeMessage(CallEvent.ACCEPT_CALL_INVITE)
  handleAcceptCallInvite(
    @MessageBody() peerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const peerClient = this.io.of('/').sockets.get(peerId);

    if (peerClient && client) {
      const roomId = nanoid();

      [peerClient, client].forEach((socket) => {
        socket.data.roomId = roomId;
        socket.join(roomId);
      });

      this.io.to(roomId).emit(CallEvent.START_CALL);
      this.callsService.create({
        senderId: peerId,
        receiverId: client.data.id,
      });
    }
  }

  @SubscribeMessage(CallEvent.DECLINE_CALL_INVITE)
  handleDeclineCallInvite(
    @MessageBody() peerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.io.to(peerId).emit(CallEvent.DECLINE_CALL_INVITE, client.data.id);
  }

  @SubscribeMessage(CallEvent.END_CALL)
  handleEndCall(
    @MessageBody() peerId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.io.to(peerId).emit(CallEvent.END_CALL, client.data.id);
  }
}
