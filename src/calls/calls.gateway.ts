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
import { AuthService } from 'src/auth/auth.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';

const CallEvent = {
  SEND_CALL_INVITE: 'SEND_CALL_INVITE',
  RECEIVE_CALL_INVITE: 'RECEIVE_CALL_INVITE',

  ACCEPT_CALL_INVITE: 'ACCEPT_CALL_INVITE',
  DECLINE_CALL_INVITE: 'DECLINE_CALL_INVITE',

  START_CALL: 'START_CALL',
  END_CALL: 'END_CALL',

  UPDATE_ICE_CANDIDATE: 'UPDATE_ICE_CANDIDATE',
  UPDATE_SESSION_DESCRIPTION: 'UPDATE_SESSION_DESCRIPTION',

  SERVER_EXCEPTION: 'SERVER_EXCEPTION',
};

const CallActor = {
  SENDER: 'sender',
  RECEIVER: 'receiver',
};

@WebSocketGateway({ namespace: '/api', cors: { origin: '*' } })
export class CallsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() io: Server;
  private socketsIds: Record<string, string>;

  constructor(
    private authService: AuthService,
    private callsService: CallsService,
  ) {
    this.socketsIds = {};
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    try {
      const { accessToken } = client.handshake.auth;

      if (!accessToken) {
        throw new UnauthorizedException();
      }

      const { email } = this.authService.decodeJwtToken(accessToken);
      const { id, name } = await this.authService.validateUser(email);

      client.data = { id, name };
      this.socketsIds[id] = client.id;
      client.join(id);
    } catch (err) {
      client.emit(CallEvent.SERVER_EXCEPTION, err);
      client.disconnect();
    }
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    const { callId, id } = client.data;

    delete this.socketsIds[id];

    client.broadcast.to(callId).emit(CallEvent.END_CALL);
  }

  @SubscribeMessage(CallEvent.SEND_CALL_INVITE)
  async handleSendCallInvite(
    @MessageBody() data: { peerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const { id, name } = client.data;
      const targetSocketId = this.socketsIds[data.peerId];

      if (!targetSocketId) {
        throw new NotFoundException();
      }

      const call = await this.callsService.create({
        senderId: data.peerId,
        receiverId: client.data.id,
      });

      this.io.to(targetSocketId).emit(CallEvent.RECEIVE_CALL_INVITE, {
        peerId: id,
        name,
        callId: call.id,
      });
    } catch (err) {
      client.emit(CallEvent.SERVER_EXCEPTION, err);
    }
  }

  @SubscribeMessage(CallEvent.ACCEPT_CALL_INVITE)
  async handleAcceptCallInvite(
    @MessageBody() data: { peerId: string; callId: string },
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const [peerClient] = await this.io.in(data.peerId).fetchSockets();

      if (!peerClient) {
        throw new NotFoundException();
      }

      [peerClient, client].forEach((socket) => {
        socket.data.callId = data.callId;
        socket.join(data.callId);
      });

      const targetSocketId = this.socketsIds[data.peerId];

      this.io.to(targetSocketId).emit(CallEvent.START_CALL, {
        callId: data.callId,
        type: CallActor.SENDER,
        peer: client.data,
      });

      client.emit(CallEvent.START_CALL, {
        callId: data.callId,
        type: CallActor.RECEIVER,
        peer: peerClient.data,
      });
    } catch (err) {
      client.emit(CallEvent.SERVER_EXCEPTION, err);
    }
  }

  @SubscribeMessage(CallEvent.DECLINE_CALL_INVITE)
  handleDeclineCallInvite(
    @MessageBody() data: { peerId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const targetSocketId = this.socketsIds[data.peerId];

    this.io
      .to(targetSocketId)
      .emit(CallEvent.DECLINE_CALL_INVITE, client.data.id);
  }

  @SubscribeMessage(CallEvent.UPDATE_ICE_CANDIDATE)
  handleUpdateIceCandidate(
    @MessageBody() data: { peerId: string; candidate: string },
  ) {
    const targetSocketId = this.socketsIds[data.peerId];

    this.io.to(targetSocketId).emit(CallEvent.UPDATE_ICE_CANDIDATE, data);
  }

  @SubscribeMessage(CallEvent.UPDATE_SESSION_DESCRIPTION)
  handleUpdateSessionDescription(
    @MessageBody() data: { peerId: string; session: RTCSessionDescriptionInit },
  ) {
    const targetSocketId = this.socketsIds[data.peerId];

    this.io.to(targetSocketId).emit(CallEvent.UPDATE_SESSION_DESCRIPTION, data);
  }

  @SubscribeMessage(CallEvent.END_CALL)
  handleEndCall(@MessageBody() data: { peerId: string; callId: string }) {
    this.io.to(data.peerId).emit(CallEvent.END_CALL);

    this.callsService.update(data.callId, { endedAt: new Date() });
  }
}
