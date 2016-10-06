import { Controller, Get, Post, Put, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import TYPES from '../constant/types';
import { IRetrospective, RetrospectiveUser } from '../../../shared/src/model';
import { UserService, RetrospectiveService } from '../service';

@injectable()
@Controller('/rest/retrospectives')
export class RetrospectiveController {

  constructor(
    @inject(TYPES.RetrospectiveService) private retrospectiveService: RetrospectiveService,
    @inject(TYPES.UserService) private userService: UserService
  ) { }

  @Get('/')
  public getRetrospectives(): IRetrospective[] {
    return this.retrospectiveService.getRetrospectives();
  }

  @Post('/')
  public createRetrospective(request: Request, response: Response): void {
    let jwtUser = this.userService.getJwtUser(request);
    let createdRetrospective = this.retrospectiveService.createRetrospective(jwtUser, request.body);

    response.location('/rest/retrospectives/' + createdRetrospective.uuid);
    response.sendStatus(201);
  }

  @Get('/:id')
  public getRetrospective(request: Request): IRetrospective {
    let jwtUser = this.userService.getJwtUser(request);
    return this.retrospectiveService.getRetrospectiveSecured(jwtUser, request.params.id);
  }

  @Put('/:id')
  public updateRetrospective(request: Request): IRetrospective {
    // TODO: authorization needed
    return this.retrospectiveService.updateRetrospective(request.params.id, request.body);
  }

  @Delete('/:id')
  public deleteRetrospective(request: Request): string {
    // TODO: authorization needed
    return this.retrospectiveService.deleteRetrospective(request.params.id);
  }

  @Get('/:id/attendees')
  public getRetrospectiveAttendees(request: Request): RetrospectiveUser[] {
    let jwtUser = this.userService.getJwtUser(request);
    return this.retrospectiveService.getRetrospectiveUsers(jwtUser, request.params.id);
  }

  @Get('/:id/attendees/:userid')
  public getRetrospectiveUser(request: Request): RetrospectiveUser {
    let jwtUser = this.userService.getJwtUser(request);
    return this.retrospectiveService.getRetrospectiveUser(jwtUser, request.params.id, request.params.userid);
  }

  @Post('/:id/attendees')
  public joinRetrospective(request: Request): void {
    let jwtUser = this.userService.getJwtUser(request);
    this.retrospectiveService.joinRetrospective(jwtUser, request.params.id);
  }

  @Get('/:id/comments')
  public getComments(request: Request) {
    // TODO: Implement
  }

  @Post('/:id/comments')
  public addComment(request: Request) {
    // TODO: Implement
  }

  @Get('/:id/comments/:commentId')
  public getComment(request: Request) {
     // TODO: Implement
  }

  @Put('/:id/comments/:commentId')
  public updateComment(request: Request) {
    // TODO: Implement
  }

}
