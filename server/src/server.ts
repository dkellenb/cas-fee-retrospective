import 'reflect-metadata';
import {interfaces, InversifyExpressServer, TYPE} from 'inversify-express-utils';
import {Kernel} from 'inversify';
import * as bodyParser from 'body-parser';
import TYPES from './constant/types';
import TAGS from './constant/tags';
import { RetrospectiveController } from './controller/RetrospectiveController';
import { RetrospectiveService } from './service/RetrospectiveService';
import { UserController } from './controller/UserController';
import { UserJwtService, UserService } from './service/';
import { UserRepository } from './repository/UserRepository';
import { UserJwtKeyProvider, UserStaticJwtKeyProvider} from './service/UserJwtKeyProvider';
import { DataAccess } from './repository/dataaccess';
import * as nconf from 'nconf';

// load everything needed to the kernel
let kernel = new Kernel();

kernel.bind<interfaces.Controller>(TYPE.Controller).to(RetrospectiveController).whenTargetNamed(TAGS.RetrospectiveController);
kernel.bind<interfaces.Controller>(TYPE.Controller).to(UserController).whenTargetNamed(TAGS.UserController);

kernel.bind<RetrospectiveService>(TYPES.RetrospectiveService).to(RetrospectiveService).inSingletonScope();
kernel.bind<UserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();
kernel.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
kernel.bind<UserJwtService>(TYPES.UserJwtService).to(UserJwtService).inSingletonScope();
kernel.bind<UserJwtKeyProvider>(TYPES.UserJwtKeyProvider).to(UserStaticJwtKeyProvider).inSingletonScope();

// read configuration
nconf.argv()
  .env()
  .file({ file: 'server-config.json' });

// start database connection
DataAccess.connect();

// start the server
let server = new InversifyExpressServer(kernel);
server.setConfig((app) => {

  // Add headers
  app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    //Location must be set as Expose-Header so Angular HTTP will pick it up and make it accessible.
    res.setHeader('Access-Control-Expose-Headers', 'Location');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Pass to next layer of middleware
    next();
  });

  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
});

let app = server.build();
app.listen(nconf.get('port'));
console.log('Server started on port ' + nconf.get('port'));