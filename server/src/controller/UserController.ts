import { Controller, Get, Post, Put, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import TYPES from '../constant/types';
import {CreateUserJSON} from '../../../shared/src/model';
import {UpdateUserJSON} from '../../../shared/src/model/UserDomainModel';


@injectable()
@Controller('/rest/users')
export class UserController {

  constructor(@inject(TYPES.UserService) private userService) {

  }

  @Get('/current')
  public getCurrentUser(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => response.send(currentUser))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Get('/')
  public getUsers(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.userService.getAllUsers(currentUser))
      .then((users) => response.send(users))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Post('/')
  public createUser(request: Request, response: Response): void {
    try {
      console.log('POST: /users/ | ' + JSON.stringify(request.body));
      let jsonData = <CreateUserJSON>request.body;
      this.userService.createUser(jsonData).then((createdUser) => {
        console.log('UserController#createUser@promise');
        response.location('/rest/users/' + createdUser.uuid + '/tokens/' + createdUser.tokens[0].uuid);
        response.sendStatus(201);
      }).catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
    } catch (err) {
      console.log(err);
      response.send({'error': 'error in your request. see server logs for details', 'details' : err});
    }
  }

  @Get('/:id/')
  public getUser(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.userService.getPublicUser(currentUser, request.params.id))
      .then((user) => response.send(user))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Put('/:id')
  public updateUser(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.userService.updateUser(currentUser, request.params.id, <UpdateUserJSON>request.body))
      .then((user) => response.send(user))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Delete('/:id')
  public deleteUser(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.userService.deleteUser(currentUser, request.params.id))
      .then((user) => response.sendStatus(204))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Get('/:id/tokens/:tokenId/')
  public getJwtForUser(request: Request, response: Response): Promise<string> {
    try {
      return this.userService.getJwt(request.params.id, request.params.tokenId);
    } catch (err) {
      console.log(err);
      response.send({'error': 'error in your request. see server logs for details', 'details' : err});
    }
  }

}
