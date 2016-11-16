import { injectable } from 'inversify';
import {RetrospectiveStatus} from '../../../shared/src/model';

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
    this.socketIO.sockets.in(retrospectiveId).emit('newUser', userId);
  }

  public commentAddedToRetrospective(retrospectiveId: string, commentId: string) {
    this.socketIO.sockets.in(retrospectiveId).emit('newComment', commentId);
  }

  public commentUpdatedOnRetrospective(retrospectiveId: string, commentId: string) {
    this.socketIO.sockets.in(retrospectiveId).emit('updatedComment', commentId);
  }

  public commentRemovedFromRetrospective(retrospectiveId: string, commentId: string) {
    this.socketIO.sockets.in(retrospectiveId).emit('deletedComment', commentId);
  }

  public retrospectiveStatusChanged(retrospectiveId: string, newStatus: RetrospectiveStatus) {
    this.socketIO.sockets.in(retrospectiveId).emit('statusChanged', { 'newStatus': newStatus });
  }

}
