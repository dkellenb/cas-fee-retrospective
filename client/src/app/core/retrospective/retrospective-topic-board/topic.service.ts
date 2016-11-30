import {Injectable} from '@angular/core';
import {IBasicRetrospectiveTopic, IRetrospectiveUser} from '../../../shared/model';
import {AuthenticationService} from '../../../shared/services/authentication.service';
import {IBasicRetrospectiveComment} from '../../../shared/model/RetrospectiveDomainModel';
import {IUser} from '../../../shared/model/UserDomainModel';

@Injectable()
export class TopicService {

  private _topic: IBasicRetrospectiveTopic<IRetrospectiveUser>;

  constructor(private authService: AuthenticationService) {
  }

  public set topic(value: IBasicRetrospectiveTopic<IRetrospectiveUser>) {
    this._topic = value;
  }

  public get topicName(): string {
    return this._topic.name;
  }

  public createNewComment() {
    let comment: IBasicRetrospectiveComment<IRetrospectiveUser> = <IBasicRetrospectiveComment<IRetrospectiveUser>>{};
    comment.author = this.getLoggedInRetrospectiveUser();
    comment.anonymous = false;
    comment.topicUuid = this._topic.uuid;
    console.log('create new comment');
    this._topic.comments.push(comment);
  }

  private getLoggedInRetrospectiveUser(): IRetrospectiveUser {
    let retroUser: IRetrospectiveUser = <IRetrospectiveUser>{};
    let user: IUser = this.authService.getLoggedInUser();

    retroUser.uuid = user.uuid;
    retroUser.shortName = user.shortName;
    retroUser.name = user.name;
    retroUser.role = user.systemRole;

    return retroUser;
  }


  public get comments(): IBasicRetrospectiveComment<IRetrospectiveUser>[] {
    return this._topic.comments;
  }

  public get ownComments(): IBasicRetrospectiveComment<IRetrospectiveUser>[] {
    return this._topic.comments.filter((comment: IBasicRetrospectiveComment<IRetrospectiveUser>) => {
      return comment.author.uuid === this.authService.getLoggedInUser().uuid;
    });
  }


}
