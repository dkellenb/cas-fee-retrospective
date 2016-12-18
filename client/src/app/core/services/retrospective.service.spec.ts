/* tslint:disable:no-unused-variable */
import {TestBed, async, inject} from '@angular/core/testing';
import {RetrospectiveService} from './retrospective.service';
import {IBasicRetrospective, IRetrospectiveUser, RetrospectiveStatus} from '../../shared/model';
import {UserService} from './user.service';
import {ConfigurationService, AuthenticationService} from '../../shared/services';
import {MockBackend} from '@angular/http/testing';
import {BaseRequestOptions, Http} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {StubUserService} from './user.service.spec';
import {WebSocketService} from './web-socket.service';
import {StubWebSocketService} from './web-socket.service.spec';

describe('Service: Retrospective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RetrospectiveService,
        ConfigurationService,
        AuthenticationService,
        MockBackend,
        BaseRequestOptions,
        {provide: UserService, useClass: StubUserService},
        {provide: WebSocketService, useClass: StubWebSocketService},
        {
          provide: AuthHttp,
          useFactory: (backend, options) => {
            return new Http(backend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });
  });

  it('should ...', inject([RetrospectiveService], (service: RetrospectiveService) => {
    expect(service).toBeTruthy();
  }));
});


export class StubRetrospectiveService extends RetrospectiveService {

  private _stubRetro: IBasicRetrospective<IRetrospectiveUser>;
  private _StubhasManagerRole = true;

  constructor() {
    super(null, null, null, null, null);

    this._stubRetro = <IBasicRetrospective<IRetrospectiveUser>> {
      uuid: '',
      name: '',
      description: 'Here is a description',
      attendees: [],
      status: RetrospectiveStatus.OPEN,
      topics: []
    };
  }

  public getCurrent(): IBasicRetrospective<IRetrospectiveUser> {
    return this._stubRetro;
  }

  public hasManagerRole(): boolean {
    return this._StubhasManagerRole;
  }

  /**
   * Set up if user should have Managerrole in Test
   * @param value
   */
  public setUpManagerRole(value: boolean) {
    this._StubhasManagerRole = value;
  }

  /**
   * Set the Currend Retro for tests
   * @param value
   */
  public set stubRetro(value: IBasicRetrospective<IRetrospectiveUser>) {
    this._stubRetro = value;
  }
}
