import { Controller, Get, Post, Put, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import TYPES from '../constant/types';
import {IUser, CreateUserJSON} from '../../../shared/src/model';


@injectable()
@Controller('/rest/users')
export class UserController {

  constructor(@inject(TYPES.UserService) private userService) {

  }

  @Get('/')
  public getUsers(): IUser[] {
    return null;
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
      }).catch((error) => {
        console.log(error);
        response.send({"error": "error in your request"});
      });
    } catch (e) {
      console.log(e);
      response.send({"error": "error in your request"});
    }
  }

  @Get('/:id/')
  public getUser(request: Request): IUser {
    return null;
  }

  @Put('/:id')
  public updateUser(request: Request): IUser {
    return null; // this.retrospectiveService.updateRetrospective(request.params.id, request.body);
  }

  @Delete('/:id')
  public deleteUser(request: Request): string {
    return null; // this.retrospectiveService.deleteRetrospective(request.params.id);
  }

  @Get('/:id/tokens/:tokenId/')
  public getJwtForUser(request: Request, response: Response): Promise<string> {
    try {
      return this.userService.getJwt(request.params.id, request.params.tokenId);
    } catch (e) {
      console.log(e);
      response.send({"error": "error in your request"});
    }
  }

}
