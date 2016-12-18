/* tslint:disable:no-unused-variable */
import {TestBed, async, inject} from '@angular/core/testing';
import {RetrospectiveService} from './retrospective.service';
import {IBasicRetrospective, IRetrospectiveUser, RetrospectiveStatus} from '../../shared/model';
import {UserService} from './user.service';
import {ConfigurationService, AuthenticationService} from '../../shared/services';
import {MockBackend, MockConnection} from '@angular/http/testing';
import {BaseRequestOptions, Http, Response, ResponseOptions, Headers, RequestMethod} from '@angular/http';
import {AuthHttp} from 'angular2-jwt';
import {StubUserService} from './user.service.spec';
import {WebSocketService} from './web-socket.service';
import {MockWebSocketService} from './web-socket.service.spec';
import {CreateCommentJSON} from '../../shared/model/retrospective/CreateCommentJSON';
import {IBasicRetrospectiveComment} from '../../shared/model/retrospective/IBasicRetrospectiveComment';

const initialRetro: IBasicRetrospective<IRetrospectiveUser> = {
  'uuid': '56e03af4-8b6c-4498-a14b-f8d87cf0dfeb',
  'name': 'Initial Retro',
  'description': 'This is a Retro like direct from the serve after creation',
  'status': 'OPEN',
  'attendees': [{'uuid': 'ea3ad9cc-1444-4153-93c4-a9ef72d37d98', 'name': '', 'shortName': 'test', 'role': 'MANAGER'}],
  'topics': [{'uuid': '11546e54-d2cb-4451-b739-bc69f175ab2a', 'name': 'Stop doing', 'comments': []}, {
    'uuid': '600bd703-ec32-4d3f-ad35-96216e999db3',
    'name': 'Continue doing',
    'comments': []
  }, {'uuid': '2c8ae4a5-cbae-4c49-9c2d-e0834277e711', 'name': 'Start doing', 'comments': []}]
};

const commentFromServer: IBasicRetrospectiveComment<IRetrospectiveUser> = {
  'uuid': '6830afdd-22cb-4171-b611-b975081e58ef',
  'title': 'Comment Title',
  'description': 'Here is a Description',
  'anonymous': true,
  'author': {'uuid': 'ea3ad9cc-1444-4153-93c4-a9ef72d37d98', 'name': '', 'shortName': 'test', 'role': 'MANAGER'},
  'votes': []
};

const jwtUserToken: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiZWEzYWQ5Y2MtMTQ0NC00MT' +
  'UzLTkzYzQtYTllZjcyZDM3ZDk4IiwidmFsaWRVbnRpbCI6MTU3NjI2NDIxMywic2hvcnROYW1lIjoidGVzdCIsIm5hbWUiOm51' +
  'bGwsImVtYWlsIjpudWxsLCJzeXN0ZW1Sb2xlIjoiVVNFUiIsImlhdCI6MTQ4MTY1NjIxNH0.wPS3jruXDXgwd8hlKKV0X60A-nmID8pl8n4z-19Raok';


describe('Service: Retrospective', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RetrospectiveService,
        ConfigurationService,
        AuthenticationService,
        MockBackend,
        BaseRequestOptions,
        MockWebSocketService,
        {provide: UserService, useClass: StubUserService},
        {
          provide: WebSocketService,
          useFactory: (mock) => {
            return mock;
          },
          deps: [MockWebSocketService]
        },
        {
          provide: AuthHttp,
          useFactory: (backend, options) => {
            return new Http(backend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        }
      ]
    });

    TestBed.get(MockWebSocketService).expectedRetroId = '56e03af4-8b6c-4498-a14b-f8d87cf0dfeb';
    TestBed.get(AuthenticationService).setAuthenticationToken(jwtUserToken);
  });

  afterEach(() => {
    TestBed.get(AuthenticationService).logoutUser();
  });

  it('should be able to inject all parts', inject([RetrospectiveService], (service: RetrospectiveService) => {
    expect(service).toBeTruthy();
  }));

  it('should have a empty retro on construction', inject([RetrospectiveService], (service: RetrospectiveService) => {
    let retro: IBasicRetrospective<IRetrospectiveUser> = service.getCurrent();

    expect(retro).toBeTruthy();
    expect(retro.status).toBe(RetrospectiveStatus.OPEN);
    expect(retro.name).toEqual('');
    expect(retro.description).toBeUndefined();
    expect(retro.attendees.length).toEqual(0);
    expect(retro.topics.length).toEqual(0);
  }));

  it('should load a retro and init websocket connection', async(inject(
    [RetrospectiveService, MockBackend, MockWebSocketService],
    (service: RetrospectiveService, backend: MockBackend, mockWebsocketService: MockWebSocketService) => {

      // SetUp
      mockWebsocketService.expectedRetroId = '123';

      backend.connections.subscribe(c => {
        expect(c.request.url).toEqual('http://localhost:3000/rest/retrospectives/123');
        expect(c.request.method).toBe(RequestMethod.Get);
        c.mockRespond(new Response(new ResponseOptions({body: initialRetro})));
      });

      // Execute
      service.getRetrospective('123').subscribe((retro: IBasicRetrospective<IRetrospectiveUser>) => {
        expect(retro).toBeTruthy();
        expect(retro).toBeTruthy();
        expect(retro.status).toEqual(RetrospectiveStatus.OPEN);
        expect(retro.name).toEqual('Initial Retro');
        expect(retro.description).toEqual('This is a Retro like direct from the serve after creation');
        expect(retro.attendees.length).toEqual(1);
        expect(retro.topics.length).toEqual(3);

        console.log(retro);
      });

      expect(mockWebsocketService.isGetWasCalled).toBe(true);
    })));

  it('should create Retrospective', async(inject(
    [RetrospectiveService, MockBackend],
    (service: RetrospectiveService, backend: MockBackend) => {

      // SetUp
      backend.connections.subscribe((c: MockConnection) => {
        expect(c.request.url).toEqual('http://localhost:3000/rest/retrospectives');
        expect(c.request.method).toBe(RequestMethod.Post);
        let body = JSON.parse(c.request.getBody());
        expect(body.name).toEqual('Title');
        expect(body.description).toEqual('Description');

        let headers: Headers = new Headers();
        headers.append('Location', 'http://localhost:3000/rest/retrospectives/123');
        c.mockRespond(new Response(new ResponseOptions({headers: headers, body: 'create', status: 201})));
      });

      // Execute
      service.createRetrospective('Title', 'Description').subscribe((retroId: string) => {
        expect(retroId).toEqual('123');
      });
    })));

  it('should create Retrospective', async(inject(
    [RetrospectiveService, MockBackend],
    (service: RetrospectiveService, backend: MockBackend) => {

      // SetUp
      backend.connections.subscribe((c: MockConnection) => {
        expect(c.request.url).toEqual('http://localhost:3000/rest/retrospectives');
        expect(c.request.method).toBe(RequestMethod.Post);
        let body = JSON.parse(c.request.getBody());
        expect(body.name).toEqual('Title');
        expect(body.description).toEqual('Description');

        let headers: Headers = new Headers();
        headers.append('Location', 'http://localhost:3000/rest/retrospectives/123');
        c.mockRespond(new Response(new ResponseOptions({headers: headers, body: 'create', status: 201})));
      });

      // Execute
      service.createRetrospective('Title', 'Description').subscribe((retroId: string) => {
        expect(retroId).toEqual('123');
      });
    })));

  it('should get Comment', async(inject(
    [RetrospectiveService, MockBackend],
    (service: RetrospectiveService, backend: MockBackend) => {

      // SetUp
      let comment: CreateCommentJSON = <CreateCommentJSON>{};
      comment.title = 'Comment Title';
      comment.description = 'Here is a Description';
      comment.anonymous = false;

      backend.connections.subscribe((c: MockConnection) => {

        // Load initial Retro in Service
        if (c.request.url === 'http://localhost:3000/rest/retrospectives/56e03af4-8b6c-4498-a14b-f8d87cf0dfeb') {
          c.mockRespond(new Response(new ResponseOptions({body: initialRetro, status: 200})));
          return;
        }

        expect(c.request.url).toEqual('http://localhost:3000/rest/retrospectives/' +
          '56e03af4-8b6c-4498-a14b-f8d87cf0dfeb/comments/6830afdd-22cb-4171-b611-b975081e58ef');
        expect(c.request.method).toBe(RequestMethod.Get);
        c.mockRespond(new Response(new ResponseOptions({body: commentFromServer, status: 200})));
      });

      // Execute
      service.getRetrospective('56e03af4-8b6c-4498-a14b-f8d87cf0dfeb')
        .subscribe(() => {
          service.getComment('6830afdd-22cb-4171-b611-b975081e58ef')
            .subscribe((returnComment: IBasicRetrospectiveComment<IRetrospectiveUser>) => {
              expect(returnComment).toEqual(commentFromServer);
            });
        });

    })));

  it('should create Comment', async(inject(
    [RetrospectiveService, MockBackend],
    (service: RetrospectiveService, backend: MockBackend) => {

      // SetUp
      let comment: CreateCommentJSON = <CreateCommentJSON>{};
      comment.title = 'Comment Title';
      comment.description = 'Here is a Description';
      comment.anonymous = false;

      backend.connections.subscribe((c: MockConnection) => {

        // Load initial Retro in Service
        if (c.request.url === 'http://localhost:3000/rest/retrospectives/56e03af4-8b6c-4498-a14b-f8d87cf0dfeb') {
          c.mockRespond(new Response(new ResponseOptions({body: initialRetro, status: 200})));
          return;
        }

        if (c.request.url === 'http://localhost:3000/rest/retrospectives/' +
          '56e03af4-8b6c-4498-a14b-f8d87cf0dfeb/comments/6830afdd-22cb-4171-b611-b975081e58ef') {
          c.mockRespond(new Response(new ResponseOptions({body: commentFromServer, status: 200})));
          return;
        }

        expect(c.request.url).toEqual('http://localhost:3000/rest/retrospectives/' +
          '56e03af4-8b6c-4498-a14b-f8d87cf0dfeb/topics/11546e54-d2cb-4451-b739-bc69f175ab2a/comments');
        expect(c.request.method).toBe(RequestMethod.Post);
        let body = JSON.parse(c.request.getBody());
        expect(body.title).toEqual(comment.title);
        expect(body.description).toEqual(comment.description);
        expect(body.anonymous).toEqual(comment.anonymous);

        let headers: Headers = new Headers();
        headers.append('Location', 'http://localhost:3000/rest/retrospectives/' +
          '56e03af4-8b6c-4498-a14b-f8d87cf0dfeb/comments/6830afdd-22cb-4171-b611-b975081e58ef');
        c.mockRespond(new Response(new ResponseOptions({headers: headers, body: commentFromServer, status: 201})));
      });

      // Execute
      service.getRetrospective('56e03af4-8b6c-4498-a14b-f8d87cf0dfeb')
        .subscribe(() => {
          service.createComment('11546e54-d2cb-4451-b739-bc69f175ab2a', comment)
            .subscribe((returnComment: IBasicRetrospectiveComment<IRetrospectiveUser>) => {
              expect(returnComment).toEqual(commentFromServer);
              console.log(returnComment);
            });
        });

    })));
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
