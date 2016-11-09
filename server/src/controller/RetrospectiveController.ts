import { Controller, Get, Post, Put, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import TYPES from '../constant/types';
import { UserService, RetrospectiveService } from '../service';
import {
  CreateRetrospectiveJSON,
  UpdateRetrospectiveJSON
} from '../../../shared/src/model/retrospective/RetrospectiveDomainModel';

@injectable()
@Controller('/rest/retrospectives')
export class RetrospectiveController {

  constructor(
    @inject(TYPES.RetrospectiveService) private retrospectiveService: RetrospectiveService,
    @inject(TYPES.UserService) private userService: UserService
  ) { }

  // TODO: send the correct http docde for error cases

  @Get('/')
  public getRetrospectives(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.getRetrospectives(currentUser))
      .then((retrospectives) => response.send(retrospectives))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Post('/')
  public createRetrospective(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.createRetrospective(currentUser, <CreateRetrospectiveJSON>request.body))
      .then((createdRetrospective) => response.location('/rest/retrospectives/' + createdRetrospective.uuid).sendStatus(201))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Get('/:id')
  public getRetrospective(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.getRetrospectiveSecured(currentUser, request.params.id))
      .then((retrospective) => response.send(retrospective))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Put('/:id')
  public updateRetrospective(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.updateRetrospective(currentUser, request.params.id,
                                                                           <UpdateRetrospectiveJSON>request.body))
      .then(() => response.sendStatus(204))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Delete('/:id')
  public deleteRetrospective(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.deleteRetrospective(currentUser, request.params.id))
      .then(() => response.sendStatus(204))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Get('/:id/attendees')
  public getRetrospectiveAttendees(request: Request, response: Response) {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.getRetrospectiveSecured(currentUser, request.params.id))
      .then((retrospective) => response.send(retrospective.attendees))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Get('/:id/attendees/:userid')
  public getRetrospectiveUser(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.getRetrospectiveSecured(currentUser, request.params.id))
      .then((retrospective) => {
        let filteredAttendee = retrospective.attendees.filter((attendee) => attendee.uuid === request.params.userid);
        response.send(filteredAttendee);
      }).catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Post('/:id/attendees')
  public joinRetrospective(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.joinRetrospective(currentUser, request.params.id))
      .then(() => response.sendStatus(204))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Get('/:id/comments')
  public getComments(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.getRetrospectiveSecured(currentUser, request.params.id))
      .then((retrospective) => response.send(retrospective.comments))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Post('/:id/comments')
  public addComment(request: Request) {
    // TODO: Implement
  }

  @Get('/:id/comments/:commentId')
  public getComment(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.getRetrospectiveSecured(currentUser, request.params.id))
      .then((retrospective) => {
        let filteredComment = retrospective.comments.filter((comment) => comment.uuid === request.params.commentId);
        response.send(filteredComment);
      }).catch((err) => {
      console.log(err);
      response.send({'error': 'error in your request. see server logs for details', 'details' : err});
    });
  }

  @Put('/:id/comments/:commentId')
  public updateComment(request: Request) {
    // TODO: Implement
  }

}
