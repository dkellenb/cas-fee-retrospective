import { injectable } from 'inversify';
import * as SocketIO from 'socket.io';
import { RetrospectiveStatus } from '../../../client/src/app/shared/model';

@injectable()
export class WebSocketService {

  private socketIO: SocketIO.Server;

  public registerSocketIO(socketIOinstance: SocketIO.Server) {
    this.socketIO = socketIOinstance;
    this.socketIO.on('connection', (client) => {
      this.registerClient(client);
    });
  }

  public registerClient(socket: SocketIO.Socket): void {
    console.log('Client connected on ' + socket.nsp.name);

    // Client: socket.emit("subscribe", { 'retrospectiveId': '123123123123123-2344' });
    socket.on('subscribe', (data) => socket.join(data.retrospectiveId));
    socket.on('unsubscribe', (data) => socket.leave(data.retrospectiveId));

    socket.on('disconnect', (event) => console.log('Client disconnected'));
  }

  public userAddedToRetrospective(retrospectiveId: string, userId: string) {
    console.log(`[WS] retrospective '${retrospectiveId}': add user '${userId}'`);
    this.socketIO.sockets.in(retrospectiveId).emit('newUser', userId);
  }

  public commentAddedToRetrospective(retrospectiveId: string, commentId: string) {
    console.log(`[WS] retrospective '${retrospectiveId}': add comment '${commentId}'`);
    this.socketIO.sockets.in(retrospectiveId).emit('newComment', commentId);
  }

  public commentUpdatedOnRetrospective(retrospectiveId: string, commentId: string) {
    console.log(`[WS] retrospective '${retrospectiveId}': update comment '${commentId}'`);
    this.socketIO.sockets.in(retrospectiveId).emit('updatedComment', commentId);
  }

  public commentRemovedFromRetrospective(retrospectiveId: string, commentId: string) {
    console.log(`[WS] retrospective '${retrospectiveId}': delete comment '${commentId}'`);
    this.socketIO.sockets.in(retrospectiveId).emit('deletedComment', commentId);
  }

  public retrospectiveStatusChanged(retrospectiveId: string, newStatus: RetrospectiveStatus) {
    console.log(`[WS] retrospective '${retrospectiveId}': change status '${newStatus}'`);
    this.socketIO.sockets.in(retrospectiveId).emit('statusChanged', newStatus);
  }

}
