/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SocketServiceService } from './socket-service.service';

describe('Service: SocketService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketServiceService]
    });
  });

  it('should ...', inject([SocketServiceService], (service: SocketServiceService) => {
    expect(service).toBeTruthy();
  }));
});
