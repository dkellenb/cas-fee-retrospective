import 'reflect-metadata';
import * as nconf from 'nconf';
import * as SocketIO from 'socket.io';
import * as express from 'express';
import * as http from 'http';
import * as bodyParser from 'body-parser';
import {Provider} from 'nconf';
import { interfaces, Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { Kernel } from 'inversify';
import TYPES from './constant/types';
import TAGS from './constant/tags';
import { RetrospectiveController } from './controller/RetrospectiveController';
import { RetrospectiveService } from './service/RetrospectiveService';
import { UserController } from './controller/UserController';
import { UserJwtService, UserService } from './service/';
import { UserRepository } from './repository/UserRepository';
import { UserJwtKeyProvider, UserStaticJwtKeyProvider} from './service/UserJwtKeyProvider';
import { DataAccess } from './repository/dataaccess';
import {RetrospectiveRepository} from './repository/RetrospectiveRepository';
import {WebSocketService} from './service/WebSocketService';

class RetroServer {

  private config: Provider;
  private kernel: any;
  private inversifyExpressServer: any;
  private app: express.Application;
  private serverInstance: http.Server;
  private databaseConnection: any;
  private socketIO: SocketIO.Server;

  // Start the application
  public static bootstrap(): RetroServer {
    return new RetroServer();
  }

  constructor() {
    // Load configuration
    this.loadConfig();

    // Setup DI kernel
    this.initKernel();

    // Setup inversify inversifyExpressServer
    this.setupInversifyExpressServer();

    // Setup http server instance
    this.initHttpServer();

    // Setup WebSockets
    this.initWebSocket();

    // Setup Database connection
    this.initDb();
  }

  private getHostName(): String {
    return process.env.APP_HOSTNAME || nconf.get('hostname');
  }

  private getPort(): Number {
    return parseInt(process.env.PORT, 10) || parseInt(nconf.get('port'), 10);
  }

  private getAllowOriginHostName(): String {
    return process.env.ALLOW_ORIGIN_HOST_NAME || nconf.get('allow_origin_host_name');
  }

  private loadConfig(): void {
    console.log('Load configuration');
    this.config = nconf.argv()
      .env()
      .file({ file: 'server-config.json' });
  }

  private initKernel(): void {
    console.log('Setup Kernel');
    let kernel = new Kernel();

    kernel.bind<interfaces.Controller>(TYPE.Controller).to(RetrospectiveController).whenTargetNamed(TAGS.RetrospectiveController);
    kernel.bind<interfaces.Controller>(TYPE.Controller).to(UserController).whenTargetNamed(TAGS.UserController);

    kernel.bind<RetrospectiveService>(TYPES.RetrospectiveService).to(RetrospectiveService).inSingletonScope();
    kernel.bind<RetrospectiveRepository>(TYPES.RetrospectiveRepository).to(RetrospectiveRepository).inSingletonScope();
    kernel.bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
    kernel.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
    kernel.bind<UserJwtService>(TYPES.UserJwtService).to(UserJwtService).inSingletonScope();
    kernel.bind<UserJwtKeyProvider>(TYPES.UserJwtKeyProvider).to(UserStaticJwtKeyProvider).inSingletonScope();
    kernel.bind<WebSocketService>(TYPES.WebSocketService).to(WebSocketService).inSingletonScope();

    this.kernel = kernel;
  }

  private setupInversifyExpressServer(): void {
    console.log('Setup InversifyExpressServer');
    const self = this;
    let server = new InversifyExpressServer(this.kernel);
    server.setConfig((app) => {

      // Add headers
      app.use(function (req, res, next) {

        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '' + self.getAllowOriginHostName());

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');

        // Location must be set as Expose-Header so Angular HTTP will pick it up and make it accessible.
        res.setHeader('Access-Control-Expose-Headers', 'Location');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', 'true');

        // intercept OPTIONS method
        if (req.method === 'OPTIONS') {
          res.send(200);
        } else {
          // Pass to next layer of middleware
          next();
        }
      });

      app.use(bodyParser.urlencoded({
        extended: true
      }));
      app.use(bodyParser.json());
      app.use(express.static('./build/public'));
    });


    this.inversifyExpressServer = server;
    this.app = server.build();
  }

  private initHttpServer(): void {
    console.log('Init HTTP Server');
    let hostname = this.getHostName();
    let port = this.getPort();
    this.serverInstance = this.app.listen(port, () => {
      console.log('Server started on port ' + port);
      console.log('');
      console.log('REST Services available on:');
      console.log(hostname + ':' + port + '/rest/users');
      console.log(hostname + ':' + port + '/rest/retrospectives');
      console.log('Full REST Documentation is availble on ../documentation/RestAPI.md');
      console.log('');
    });
  }

  private initWebSocket(): void {
    console.log('Init WebSockets');
    let socketIO = SocketIO().listen(this.serverInstance, <SocketIO.ServerOptions>{
      'path': '/socket/'
    });

    let webSocketService = <WebSocketService>this.kernel.get(TYPES.WebSocketService);
    webSocketService.registerSocketIO(socketIO);

    this.socketIO = socketIO;
  }

  private initDb(): void {
    console.log('Init DB');
    this.databaseConnection = DataAccess.connect();
  }

}

RetroServer.bootstrap();
