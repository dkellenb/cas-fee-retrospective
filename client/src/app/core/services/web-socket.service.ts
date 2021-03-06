import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import { ConfigurationService } from '../../shared';

@Injectable()
export class WebSocketService {

  private socket: SocketIOClient.Socket;

  constructor(private configurationService: ConfigurationService) {
  }

  public get(retrospectiveId: string): Observable<WebSocketAction> {
    if (!this.socket) {
      this.socket = io.connect(this.configurationService.serverHostUrl, {
        path: this.configurationService.webSocketUrl
      });
      this.socket.on('connect', () => this.connect(retrospectiveId));
      this.socket.on('disconnect', () => this.disconnect(retrospectiveId));
      this.socket.on('error', (error: string) => {
        console.log(`ERROR: "${error}" (${this.configurationService.webSocketUrl})`);
      });
    }

    // Return the observable which will follow the required events
    return Observable.create((observer: any) => {
      this.socket.on('newUser', (userId: string) => observer.next({ action: 'newUser', id: userId}) );
      this.socket.on('newComment', (commentId: string) => observer.next({ action: 'newComment', id: commentId}) );
      this.socket.on('updatedComment', (commentId: string) => observer.next({ action: 'updatedComment', id: commentId}) );
      this.socket.on('deletedComment', (commentId: string) => observer.next({ action: 'deletedComment', id: commentId}) );
      this.socket.on('statusChanged', (newStatus: string) => observer.next({ action: 'newStatus', newStatus}) );

      // TODO: Check at which time the socket shall be closed
      return () => {
        this.socket.close();
        this.socket = null;
      };
    });
  }

  private connect(retrospectiveId: string) {
    this.socket.emit('subscribe', { retrospectiveId });
    console.log(`Connected to "${retrospectiveId}"`);
  }

  private disconnect(retrospectiveId: string) {
    this.socket.emit('disconnect', { retrospectiveId });
    console.log(`Disconnect from "${retrospectiveId}`);
  }

}

export class WebSocketAction {
  action: string;
  id?: string;
  newStatus?: string;
}
