/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {WebSocketService} from './web-socket.service';
import {ConfigurationService} from '../../shared/services/configuration.service';

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

export class StubWebSocketService extends WebSocketService {
  constructor() {
    super(null);
  }
}
