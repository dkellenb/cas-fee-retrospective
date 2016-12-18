/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {WebSocketService, WebSocketAction} from './web-socket.service';
import {ConfigurationService} from '../../shared/services/configuration.service';
import {Observable, Subject} from 'rxjs';

describe('Service: WebSocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        WebSocketService,
        ConfigurationService
      ]
    });
  });

  it('should ...', inject([WebSocketService], (service: WebSocketService) => {
    expect(service).toBeTruthy();
  }));
});


export class MockWebSocketService extends WebSocketService {

  public expectedRetroId: string;
  public isGetWasCalled: boolean;
  private _websocketAction$: Subject<WebSocketAction> = new Subject<WebSocketAction>();

  constructor() {
    super(null);
  }

  public get(retrospectiveId: string): Observable<WebSocketAction> {
    expect(retrospectiveId).toEqual(this.expectedRetroId);
    this.isGetWasCalled = true;
    return this._websocketAction$;
  }

  public sendWebsocketAction(action: WebSocketAction) {
    this._websocketAction$.next(action);
  }
}
