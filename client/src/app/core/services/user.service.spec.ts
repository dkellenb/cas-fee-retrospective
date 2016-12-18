/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {UserService} from './user.service';
import {Http, BaseRequestOptions} from '@angular/http';
import {MockBackend} from '@angular/http/testing';
import {AuthHttp} from 'angular2-jwt';
import {AuthenticationService, ConfigurationService} from '../../shared/services';

describe('Service: User', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        ConfigurationService,
        AuthenticationService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => {
            return new Http(backend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        {
          provide: AuthHttp,
          useFactory: (backend, options) => {
            return new Http(backend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ],
    });
  });

  // it('should construct', async(inject(
  //   [UserService, MockBackend], (service, mockBackend) => {
  //
  //     expect(service).toBeDefined();
  //   })));

  it('should ...', inject([UserService], (service: UserService) => {
    expect(service).toBeTruthy();
  }));
});

export class StubUserService extends UserService {
  constructor() {
    super(null, null, null, null);
  }
}
