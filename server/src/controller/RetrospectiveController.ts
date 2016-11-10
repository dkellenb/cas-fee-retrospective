import { Controller, Get, Post, Put, Delete } from 'inversify-express-utils';
import { injectable, inject } from 'inversify';
import { Request, Response } from 'express';
import TYPES from '../constant/types';
import { UserService, RetrospectiveService } from '../service';
import {
  CreateRetrospectiveJSON,
  UpdateRetrospectiveJSON, CreateCommentJSON
} from '../../../shared/src/model/RetrospectiveDomainModel';

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

  @Get('/:id/topics')
  public getTopics(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.getRetrospectiveSecured(currentUser, request.params.id))
      .then((retrospective) => response.send(retrospective.topics))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Get('/:id/topics/:topicid')
  public getTopic(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.getRetrospectiveSecured(currentUser, request.params.id))
      .then((retrospective) => response.send(retrospective.topics.find((topic) => topic.uuid === request.params.topicid)))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Get('/:id/topics/:topicid/comments')
  public getComments(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.getRetrospectiveSecured(currentUser, request.params.id))
      .then((retrospective) => retrospective.topics.find((topic) => topic.uuid === request.params.topicid))
      .then((topic) => {
        if (topic) {
          response.send(topic.comments);
        } else {
          response.sendStatus(404);
        }
      })
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Post('/:id/topics/:topicid/comments')
  public updateComment(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.addComment(currentUser, request.params.id, request.params.topicid,
                                                                  <CreateCommentJSON>request.body))
      .then((createdComment) => response.location(
          '/rest/retrospectives/' + request.params.id + '/topics/' + request.params.topicid + '/comments/' + createdComment.uuid
        ).sendStatus(201))
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

  @Get('/:id/topics/:topicid/comments/:cid')
  public getComment(request: Request, response: Response): void {
    this.userService.getJwtUser(request)
      .then((currentUser) => this.retrospectiveService.getRetrospectiveSecured(currentUser, request.params.id))
      .then((retrospective) => retrospective.topics.find((topic) => topic.uuid === request.params.topicid))
      .then((topic) => {
        if (topic) {
          response.send(topic.comments.find((comment) => comment.uuid === request.params.cid));
        } else {
          response.sendStatus(404);
        }
      })
      .catch((err) => {
        console.log(err);
        response.send({'error': 'error in your request. see server logs for details', 'details' : err});
      });
  }

}
