import { Controller, Get, Post, Put, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import TYPES from '../constant/types';
import {IUser} from '../../../shared/src/model/user/User';
import {CreateUserJSON} from '../../../shared/src/model/user/CreateUserJSON';


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
  public createUser(request: Request, response: Response) {
    let jsonData = <CreateUserJSON>request.body;

    let createdUser = this.userService.createUser(jsonData);

    response.location('/rest/users/' + createdUser.uuid.getId() + '/tokens/' + createdUser.token[0].uuid);
    response.sendStatus(201);
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
  public getJwtForUser(request: Request): string {
    return this.userService.getJwt(request.params.id, request.params.tokenId);
  }

}
