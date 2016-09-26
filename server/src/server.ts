import 'reflect-metadata';
import { interfaces, Controller, InversifyExpressServer, TYPE } from 'inversify-express-utils';
import { Kernel } from 'inversify';
import * as bodyParser from 'body-parser';
import TYPES from './constant/types';
import TAGS from './constant/tags';
import { RetrospectiveController } from './controller/retrospective';
import { RetrospectiveService } from './service/retrospective';
import { UserController } from './controller/user';
import { UserJwtService } from './service/UserJwtService';
import { UserRepository } from './service/user';

// load everything needed to the kernel
let kernel = new Kernel();

kernel.bind<interfaces.Controller>(TYPE.Controller).to(RetrospectiveController).whenTargetNamed(TAGS.RetrospectiveController);
kernel.bind<interfaces.Controller>(TYPE.Controller).to(UserController).whenTargetNamed(TAGS.UserController);
kernel.bind<RetrospectiveService>(TYPES.RetrospectiveService).to(RetrospectiveService);
kernel.bind<UserJwtService>(TYPES.UserJwtService).to(UserJwtService);
kernel.bind<UserRepository>(TYPES.UserRepository).to(UserRepository);

// start the server
let server = new InversifyExpressServer(kernel);
server.setConfig((app) => {
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.use(bodyParser.json());
});

let app = server.build();
app.listen(3000);
console.log('Server started on port 3000 :)');
