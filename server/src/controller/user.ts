import { Controller, Get, Post, Put, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request } from 'express';
import { IUser } from "../../../shared/src/model/user";
import { sign } from 'jsonwebtoken';

@injectable()
@Controller('/rest/users')
export class UserController {

  @Get('/')
  public getUsers(): IUser[] {
    return null;
  }

  @Post('/')
  public createUser(request: Request): IUser {
    return null; //this.retrospectiveService.createRetrospective(request.body);
  }

  @Get('/:id/')
  public getUser(request: Request): IUser {
    return null;
  }

  @Put('/:id')
  public updateUser(request: Request): IUser {
    return null; //this.retrospectiveService.updateRetrospective(request.params.id, request.body);
  }

  @Delete('/:id')
  public deleteUser(request: Request): string {
    return null; // this.retrospectiveService.deleteRetrospective(request.params.id);
  }

}