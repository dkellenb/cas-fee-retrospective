import { injectable, inject } from 'inversify';
import { CreateRetrospectiveJSON, IUser } from '../../../shared/src/model';
import TYPES from '../constant/types';
import {UserRepository, RetrospectiveRepository, RetrospectiveDbModel} from '../repository/';
import {
  RetrospectiveStatus, UpdateRetrospectiveJSON, IBasicRetrospective,
  CreateCommentJSON, UpdateCommentJSON
} from '../../../shared/src/model/RetrospectiveDomainModel';
import {
  IPersistedRetrospectiveDbModel, PersistedRetrospectiveTopic,
  PersistedRetrospectiveComment, IPersistedRetrospectiveTopic, IPersistedRetrospectiveComment
} from '../repository/model/RetrospectiveDbModel';
import {UUID} from '../../../shared/src/util/UUID';
import {RetrospectiveUser} from './model/User';
import {PublicRetrospective} from './model/Restrospective';
import {IUserDbModel} from '../repository/model/UserDbModel';
import {UserRole} from '../../../shared/src/model/UserDomainModel';


@injectable()
export class RetrospectiveService {

  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.RetrospectiveRepository) private retrospectiveRepository: RetrospectiveRepository,
  ) {

  }

  public getRetrospectives(currentUser: IUser): Promise<IBasicRetrospective<RetrospectiveUser>[]> {
    return new Promise<IPersistedRetrospectiveDbModel>((resolve, reject) => {
      // TODO IMPLEMENT
    });
  }

  public getRetrospective(uuid: string): Promise<PublicRetrospective> {
    return new Promise<PublicRetrospective>((resolve, reject) => {
      this.retrospectiveRepository.findByUuidPopulated(uuid, (error, retrospective) => {
        if (error) {
          reject(error);
        } else if (!retrospective) {
          reject('Could not find retrospective ' + uuid);
        } else {
          resolve(PublicRetrospective.fromRetrospective(retrospective));
        }
      });
    });
  }

  public getRetrospectiveSecured(currentUser: IUser, uuid: string): Promise<PublicRetrospective> {
    return new Promise<PublicRetrospective>((resolve, reject) => {
      this.getRetrospective(uuid)
        .then((retrospective) => {
          if (retrospective.attendees.find((attendee) => attendee.uuid === currentUser.uuid)) {
            resolve(retrospective);
          } else {
            reject('Illegal access to retrospective ' + uuid);
          }
        }).catch((err) => reject(err));
    });
  }

  public createRetrospective(currentUser: IUser, createRetrospectiveJSON: CreateRetrospectiveJSON):
      Promise<IPersistedRetrospectiveDbModel> {
    return new Promise<IPersistedRetrospectiveDbModel>((resolve, reject) => {
      let retrospective = <IPersistedRetrospectiveDbModel>new RetrospectiveDbModel();
      retrospective.uuid = new UUID().toString();
      retrospective.status = RetrospectiveStatus.OPEN;
      retrospective.name = createRetrospectiveJSON.name;
      retrospective.description = createRetrospectiveJSON.description;
      retrospective.topics = [ new PersistedRetrospectiveTopic('Stop doing'),
                               new PersistedRetrospectiveTopic('Continue doing'),
                               new PersistedRetrospectiveTopic('Start doing')
                             ];
      this.userRepository.findByUuid(currentUser.uuid, (error, user) => {
        if (error) {
          reject(error);
        } else {
          retrospective.attendees.push(user._id);
          retrospective.manager = user._id;
          retrospective.save((err, createdRetrospective) => {
            if (err) {
              reject(err);
            } else {
              resolve(createdRetrospective);
            }
          });
        }
      });
    });
  }

  public updateRetrospective(currentUser: IUser, id: string, retrospective: UpdateRetrospectiveJSON):
       IBasicRetrospective<RetrospectiveUser> {
    // TODO IMPLEMENT
    return null;
  }

  public deleteRetrospective(currentUser: IUser, id: string): string {
    // TODO IMPLEMENT
    return null;
  }

  public getRetrospectiveUsers(currentUser: IUser, id: string): Promise<RetrospectiveUser[]> {
    return new Promise<RetrospectiveUser[]>((resolve, reject) => {
      this.getRetrospectiveSecured(currentUser, id).then((retrospective) => {
        // as get retrospective secured return all references loaded, we can safely cast here and two lines bellow
        resolve(retrospective.attendees);
      }).catch((err) => reject(err));
    });
  }

  public getRetrospectiveUser(currentUser: IUser, id: string, uuid: string): Promise<RetrospectiveUser> {
    return new Promise<RetrospectiveUser>((resolve, reject) => {
      this.getRetrospectiveSecured(currentUser, id).then((retrospective) => {
        // as get retrospective secured return all references loaded, we can safely cast here and two lines bellow
        resolve(retrospective.attendees.find((attendee) => attendee.uuid === uuid));
      }).catch((err) => reject(err));
    });
  }

  public joinRetrospective(currentUser: IUser, id: string): Promise<IPersistedRetrospectiveDbModel> {
    return new Promise<IPersistedRetrospectiveDbModel>((resolve, reject) => {
      this.doRetrospectiveAction(currentUser, id, (error, persistedRetrospective, persistedUser) => {
        if (error) {
          reject(error);
        } else {
          if (persistedRetrospective.attendees.find((attendeeId) => {
              console.log(attendeeId + ' vs ' + persistedUser._id);
              return attendeeId === persistedUser._id;
            }) === null) {
            console.log('Register user ' + currentUser.uuid + ' to ' + id);
            persistedRetrospective.attendees.push(persistedUser._id);
            persistedRetrospective.save();
          }
          resolve(persistedRetrospective);
        }
      });
    });
  }

  public addComment(currentUser: IUser, id: string, topicId: string, comment: CreateCommentJSON): Promise<PersistedRetrospectiveComment> {
    return new Promise<PersistedRetrospectiveComment>((resolve, reject) => {
      this.doTopicAction(currentUser, id, topicId, (error, persistedRetrospective, persistedTopic, persistedUser) => {
        if (error) {
          reject(error);
        } else {
          let persistedComment = new PersistedRetrospectiveComment(comment.description, comment.title, comment.anonymous);
          persistedComment.author = persistedUser._id;
          persistedTopic.comments.push(persistedComment);

          persistedRetrospective.save((err) => {
            if (err) {
              reject(err);
            } else {
              resolve(persistedComment);
            }
          });
        }
      });
    });
  }

  public updateComment(currentUser: IUser, retroId: string, topicId: string, commentId: string, updateComment: UpdateCommentJSON):
     Promise<PersistedRetrospectiveComment> {
    return new Promise<PersistedRetrospectiveComment>((resolve, reject) => {
      this.doCommentAction(currentUser, retroId, topicId, commentId, (error, pRetrospective, pTopic, pComment, pUser) => {
        if (error) {
          reject(error);
        } else {
          pComment.title = updateComment.title || pComment.title;
          pComment.description = updateComment.description || pComment.description;
          pRetrospective.save();
          resolve(pComment);
        }
      });
    });
  }

  public deleteComment(currentUser: IUser, retroId: string, topicId: string, commentId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.doCommentAction(currentUser, retroId, topicId, commentId, (error, pRetrospective, pTopic, pComment, pUser) => {
        if (error) {
          reject(error);
        } else {
          pTopic.comments = pTopic.comments.filter((comment) => comment.uuid !== commentId);
          pRetrospective.save();
          resolve();
        }
      });
    });
  }

  private doRetrospectiveAction(currentUser: IUser, retroId: string,
                                action: (error: any, retro?: IPersistedRetrospectiveDbModel, user?: IUserDbModel) => void): void {
    this.retrospectiveRepository.findByUuid(retroId, (retrospectiveLoadError, persistedRetrospective) => {
      if (retrospectiveLoadError) {
        action(retrospectiveLoadError);
      } else {
        this.userRepository.findByUuid(currentUser.uuid, (userLoadError, persistedUser) => {
          if (userLoadError) {
            action(userLoadError);
          } else {
            action(null, persistedRetrospective, persistedUser);
          }
        });
      }
    });
  }

  private doTopicAction(currentUser: IUser, retroId: string, topicId: string,
                        action: (error: any, retro?: IPersistedRetrospectiveDbModel,
                                 topic?: IPersistedRetrospectiveTopic, user?: IUserDbModel) => void): void {
    this.doRetrospectiveAction(currentUser, retroId, (error, persistedRetrospective, persistedUser) => {
      if (error) {
        action(error);
      } else {
        if (persistedRetrospective.attendees.find((attendeeId) => {
            return attendeeId === persistedUser._id;
          }) === null) {
          action('User is not part of this retrospective');
        }
        let topic = persistedRetrospective.topics.find((topicEntry) => topicEntry.uuid === topicId);
        if (topic == null) {
          action('Topic could not be found');
        }
        action(null, persistedRetrospective, topic, persistedUser);
      }
    });
  }

  private doCommentAction(currentUser: IUser, retroId: string, topicId: string, commentId: string,
                          action: (error: any, retro?: IPersistedRetrospectiveDbModel,
                                   topic?: IPersistedRetrospectiveTopic, comment?: IPersistedRetrospectiveComment,
                                   user?: IUserDbModel) => void): void {
    this.doTopicAction(currentUser, retroId, topicId, (error, persistedRetrospective, persistedTopic, persistedUser) => {
      if (error) {
        action(error);
      } else {
        let comment = persistedTopic.comments.find((comment) => commentId === comment.uuid);
        if (comment == null) {
          action('Comment could not be found');
        }
        if (comment.author !== persistedUser._id && persistedUser.systemRole !== UserRole.ADMIN) {
          action('Not allowed to modify this comment');
        } else {
          action(null, persistedRetrospective, persistedTopic, comment, persistedUser);
        }
      }
    });
  }

}
