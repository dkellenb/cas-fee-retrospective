import { injectable, inject } from 'inversify';
import TYPES from '../constant/types';
import {UserRepository, RetrospectiveRepository, RetrospectiveDbModel} from '../repository/';
import {
  CreateRetrospectiveJSON, IUser,
  RetrospectiveStatus, UpdateRetrospectiveJSON, IBasicRetrospective,
  CreateCommentJSON, UpdateCommentJSON, ChangeStatusJSON, UserRole
} from '../../../client/src/app/shared/model/';
import {
  IPersistedRetrospectiveDbModel, PersistedRetrospectiveTopic,
  PersistedRetrospectiveComment, IPersistedRetrospectiveTopic, IPersistedRetrospectiveComment,
  PersistedRetrospectiveVote, IPersistedRetrospectiveVote
} from '../repository/model/RetrospectiveDbModel';
import {UUID} from '../../../client/src/app/shared/util/UUID';
import {RetrospectiveUser} from './model/User';
import {PublicRetrospective} from './model/Restrospective';
import {IUserDbModel} from '../repository/model/UserDbModel';
import {WebSocketService} from './WebSocketService';


@injectable()
export class RetrospectiveService {

  /**
   * Checks if a user can modify a retrospective.
   *
   * @param persistedRetrospective the retrospective
   * @param persistedUser the user
   * @returns {boolean} {@code true} if allowed
   */
  static canModifyRetrospective(persistedRetrospective: IPersistedRetrospectiveDbModel, persistedUser: IUserDbModel): boolean {
    return persistedRetrospective.manager.equals(persistedUser._id) || persistedUser.systemRole === UserRole.ADMIN;
  }

  /**
   * Checks if a user can create a comment.
   *
   * @param persistedRetrospective the retrospective
   * @param persistedUser the user
   * @returns {boolean} {@code true} if allowed
   */
  static canCreateComment(persistedRetrospective: IPersistedRetrospectiveDbModel, persistedUser: IUserDbModel): boolean {
    return persistedRetrospective.status === RetrospectiveStatus.OPEN
      || RetrospectiveService.canModifyRetrospective(persistedRetrospective, persistedUser);
  }

  /**
   * Checks if a user can update the given comment
   *
   * @param persistedRetrospective the retrospective
   * @param persistedUser the user
   * @param persistedComment the comment which should be updated
   * @returns {boolean} {@code true} if allowed
   */
  static canUpdateComment(persistedRetrospective: IPersistedRetrospectiveDbModel, persistedUser: IUserDbModel,
                          persistedComment: IPersistedRetrospectiveComment): boolean {
    return (persistedRetrospective.status === RetrospectiveStatus.OPEN && persistedComment.author.equals(persistedUser._id))
      || RetrospectiveService.canModifyRetrospective(persistedRetrospective, persistedUser);
  }

  /**
   * Checks if a user can vote on a given comment
   *
   * @param persistedRetrospective the retrospective
   * @param persistedUser the user
   * @returns {boolean} {@code true} if allowed
   */
  static canVote(persistedRetrospective: IPersistedRetrospectiveDbModel, persistedUser: IUserDbModel): boolean {
    return persistedRetrospective.status === RetrospectiveStatus.VOTE
      || RetrospectiveService.canModifyRetrospective(persistedRetrospective, persistedUser);
  }

  /**
   * C'tor with all dependencies (typically injected).
   *
   * @param userRepository the user repository
   * @param retrospectiveRepository the retrospective repository
   * @param webSocketService web socket service
   */
  constructor(
    @inject(TYPES.UserRepository) private userRepository: UserRepository,
    @inject(TYPES.RetrospectiveRepository) private retrospectiveRepository: RetrospectiveRepository,
    @inject(TYPES.WebSocketService) private webSocketService: WebSocketService
  ) {

  }

  /**
   * Retrieves all retrospective. At the moment only available to admin. Easily extendible to see all retrospectives
   * a user can see (e.g. everywhere where he is a participant.
   *
   * @param currentUser the current user
   * @returns {Promise<IPersistedRetrospectiveDbModel>} all retrospectives (a user can see)
   */
  public getRetrospectives(currentUser: IUser): Promise<IBasicRetrospective<RetrospectiveUser>[]> {
    return new Promise<IPersistedRetrospectiveDbModel>((resolve, reject) => {
      if (currentUser.systemRole !== UserRole.ADMIN) {
        reject('Only system admin can see all persisted retrospectives');
      } else {
        this.retrospectiveRepository.findAll((error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      }
    });
  }

  /**
   * Retrieves a single retrospective. Note: Is not secured.
   *
   * @param uuid retrospective to see.
   * @returns {Promise<PublicRetrospective>}
   */
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

  /**
   * Retrieves a a single retrospective, checks if the user is privileged to see it.
   *
   * @param currentUser
   * @param uuid
   * @returns {Promise<PublicRetrospective>}
   */
  public getPublicRetrospectiveSecured(currentUser: IUser, uuid: string): Promise<PublicRetrospective> {
    return new Promise<PublicRetrospective>((resolve, reject) => {
      this.getRetrospective(uuid)
        .then((retrospective) => {
          if (retrospective.attendees.find((attendee) => attendee.uuid === currentUser.uuid) || currentUser.systemRole === UserRole.ADMIN) {
            resolve(retrospective);
          } else {
            reject('Illegal access to retrospective ' + uuid);
          }
        }).catch((err) => reject(err));
    });
  }

  /**
   * Creates a retrospective.
   *
   * @param currentUser the user (and also manager)
   * @param createRetrospectiveJSON details of the retrospective
   * @returns {Promise<IPersistedRetrospectiveDbModel>}
   */
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
          this.retrospectiveRepository.save(retrospective, (err, createdRetrospective) => {
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

  /**
   * Updates a a retrospective.
   *
   * @param currentUser the current user
   * @param retrospectiveId the retrospective to update
   * @param updateRetrospective details to update
   * @returns {Promise<IPersistedRetrospectiveDbModel>}
   */
  public updateRetrospective(currentUser: IUser, retrospectiveId: string, updateRetrospective: UpdateRetrospectiveJSON):
       Promise<IPersistedRetrospectiveDbModel> {
    return new Promise<IPersistedRetrospectiveDbModel>((resolve, reject) => {
      this.doRetrospectiveAction(currentUser, retrospectiveId, (error, persistedRetrospective, persistedUser) => {
        if (error) {
          reject(error);
        } else {
          if (!RetrospectiveService.canModifyRetrospective(persistedRetrospective, persistedUser)) {
            reject('User "' + currentUser.uuid + '" is not allowed to edit retrospective "' + retrospectiveId + '"');
          } else {
            persistedRetrospective.name = updateRetrospective.name;
            persistedRetrospective.description = updateRetrospective.description;
            persistedRetrospective.save();
            resolve(persistedRetrospective);
          }
        }
      });
    });
  }

  /**
   * Deletion of a retrospective.
   *
   * @param currentUser the current user
   * @param retrospectiveId the retrospective to be deleted
   * @returns {Promise<void>}
   */
  public deleteRetrospective(currentUser: IUser, retrospectiveId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.doRetrospectiveAction(currentUser, retrospectiveId, (error, persistedRetrospective, persistedUser) => {
        if (error) {
          reject(error);
        } else {
          if (!RetrospectiveService.canModifyRetrospective(persistedRetrospective, persistedUser)) {
            reject('User "' + currentUser.uuid + '" is not allowed to edit retrospective "' + retrospectiveId + '"');
          } else {
            this.retrospectiveRepository.delete(persistedRetrospective._id, (deleteError, result) => {
              if (deleteError) {
                reject(deleteError);
              } else {
                resolve();
              }
            });
          }
        }
      });
    });
  }

  /**
   * Change the state of a retrospective.
   *
   * @param currentUser the current user
   * @param retrospectiveId the retrospective to change
   * @param action the action
   * @returns {Promise<IPersistedRetrospectiveDbModel>}
   */
  public changeStatus(currentUser: IUser, retrospectiveId: string, action: ChangeStatusJSON): Promise<IPersistedRetrospectiveDbModel> {
    return new Promise<IPersistedRetrospectiveDbModel>((resolve, reject) => {
      this.doRetrospectiveAction(currentUser, retrospectiveId, (error, persistedRetrospective, persistedUser) => {
        if (error) {
          reject(error);
        } else {
          if (!RetrospectiveService.canModifyRetrospective(persistedRetrospective, persistedUser)) {
            reject('User "' + currentUser.uuid + '" is not allowed to edit retrospective "' + retrospectiveId + '"');
          } else {
            persistedRetrospective.status = action.status;
            this.retrospectiveRepository.save(persistedRetrospective, (err, result) => {
              if (err) {
                reject(err);
              } else {
                this.webSocketService.retrospectiveStatusChanged(retrospectiveId, action.status);
                resolve(result);
              }
            });
          }
        }
      });
    });
  }

  /**
   * All users of this retrospective.
   *
   * @param currentUser the current user
   * @param retrospectiveId the retrospective id
   * @returns {Promise<RetrospectiveUser[]>}
   */
  public getRetrospectiveUsers(currentUser: IUser, retrospectiveId: string): Promise<RetrospectiveUser[]> {
    return new Promise<RetrospectiveUser[]>((resolve, reject) => {
      this.getPublicRetrospectiveSecured(currentUser, retrospectiveId).then((retrospective) => {
        // as get retrospective secured return all references loaded, we can safely cast here and two lines bellow
        resolve(retrospective.attendees);
      }).catch((err) => reject(err));
    });
  }

  /**
   * A specific retrospective user.
   *
   * @param currentUser the current user
   * @param retrospectiveId the retrospective id
   * @param uuid the user details to see
   * @returns {Promise<RetrospectiveUser>}
   */
  public getRetrospectiveUser(currentUser: IUser, retrospectiveId: string, uuid: string): Promise<RetrospectiveUser> {
    return new Promise<RetrospectiveUser>((resolve, reject) => {
      this.getPublicRetrospectiveSecured(currentUser, retrospectiveId).then((retrospective) => {
        // as get retrospective secured return all references loaded, we can safely cast here and two lines bellow
        resolve(retrospective.attendees.find((attendee) => attendee.uuid === uuid));
      }).catch((err) => reject(err));
    });
  }

  /**
   * Join of a retrospective.
   *
   * @param currentUser the current user
   * @param retrospectiveId the retrospective to join
   * @returns {Promise<IPersistedRetrospectiveDbModel>}
   */
  public joinRetrospective(currentUser: IUser, retrospectiveId: string): Promise<IPersistedRetrospectiveDbModel> {
    return new Promise<IPersistedRetrospectiveDbModel>((resolve, reject) => {
      this.doRetrospectiveAction(currentUser, retrospectiveId, (error, persistedRetrospective, persistedUser) => {
        if (error) {
          reject(error);
        } else {
          let userPartOfAttendees = persistedRetrospective.attendees.find((attendeeId) => {
            console.log(attendeeId + ' vs ' + persistedUser._id + ' : ' + attendeeId.equals(persistedUser._id));
            return attendeeId.equals(persistedUser._id);
          });
          if (!userPartOfAttendees) {
            console.log('Register user ' + currentUser.uuid + ' to ' + retrospectiveId);
            persistedRetrospective.attendees.push(persistedUser._id);
            persistedRetrospective.save();
          } else {
            console.log(persistedUser._id + ' already found in ' + persistedRetrospective.attendees);
          }
          this.webSocketService.userAddedToRetrospective(retrospectiveId, currentUser.uuid);
          resolve(persistedRetrospective);
        }
      });
    });
  }

  /**
   * Add a comment to a retrospective (and topic).
   *
   * @param currentUser the current user
   * @param retrospectiveId the retrospective to update
   * @param topicId the topic to which the comment should belong to
   * @param comment the comment
   * @returns {Promise<PersistedRetrospectiveComment>}
   */
  public addComment(currentUser: IUser, retrospectiveId: string, topicId: string, comment: CreateCommentJSON):
      Promise<PersistedRetrospectiveComment> {
    return new Promise<PersistedRetrospectiveComment>((resolve, reject) => {
      this.doTopicAction(currentUser, retrospectiveId, topicId, (error, persistedRetrospective, persistedTopic, persistedUser) => {
        if (error) {
          reject(error);
        } else {
          if (!RetrospectiveService.canCreateComment(persistedRetrospective, persistedUser)) {
            reject('Not allowed to create comment. Most probably retro has changed its status.');
          } else {
            let persistedComment = new PersistedRetrospectiveComment(comment.description, comment.title, comment.anonymous);
            persistedComment.author = persistedUser._id;
            persistedTopic.comments.push(persistedComment);

            persistedRetrospective.save((err) => {
              if (err) {
                reject(err);
              } else {
                this.webSocketService.commentAddedToRetrospective(retrospectiveId, persistedComment.uuid);
                resolve(persistedComment);
              }
            });
          }
        }
      });
    });
  }

  /**
   * Update of a comment.
   *
   * @param currentUser the current user
   * @param retroId the retrospective to which the comment belongs to
   * @param topicId the topic to which the comment belongs to
   * @param commentId the comment to update
   * @param updateComment the new comment details
   * @returns {Promise<IPersistedRetrospectiveComment>}
   */
  public updateComment(currentUser: IUser, retroId: string, topicId: string, commentId: string, updateComment: UpdateCommentJSON):
     Promise<IPersistedRetrospectiveComment> {
    return new Promise<IPersistedRetrospectiveComment>((resolve, reject) => {
      this.doCommentAction(currentUser, retroId, topicId, commentId, (error, pRetrospective, pTopic, pComment, pUser) => {
        if (error) {
          reject(error);
        } else {
          if (!RetrospectiveService.canUpdateComment(pRetrospective, pUser, pComment)) {
            reject('Not allowed to update comment. Most probably retro has changed its status.');
          } else {
            pComment.title = updateComment.title || pComment.title;
            pComment.description = updateComment.description || pComment.description;
            pComment.anonymous = updateComment.anonymous || pComment.anonymous;
            pRetrospective.save();
            this.webSocketService.commentUpdatedOnRetrospective(retroId, pComment.uuid);
            resolve(pComment);
          }
        }
      });
    });
  }

  /**
   * Deletion of a comment.
   *
   * @param currentUser the current user
   * @param retroId the retrospective to which the comment belongs to
   * @param topicId the topic to which the comment belongs to
   * @param commentId the id of the comment to be deleted
   * @returns {Promise<void>}
   */
  public deleteComment(currentUser: IUser, retroId: string, topicId: string, commentId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.doCommentAction(currentUser, retroId, topicId, commentId, (error, pRetrospective, pTopic, pComment, pUser) => {
        if (error) {
          reject(error);
        } else {
          if (!RetrospectiveService.canUpdateComment(pRetrospective, pUser, pComment)) {
            reject('Not allowed to delete comment. Most probably retro has changed its status.');
          } else {
            pTopic.comments = pTopic.comments.filter((comment) => comment.uuid !== commentId);
            pRetrospective.save();
            this.webSocketService.commentRemovedFromRetrospective(retroId, pComment.uuid);
            resolve();
          }
        }
      });
    });
  }

  /**
   * Create a vote on a comment.
   *
   * @param currentUser the current user
   * @param retroId the retrospective to which the comment belongs to
   * @param topicId the topic to which the comment belongs to
   * @param commentId the comment to vote on
   * @returns {Promise<IPersistedRetrospectiveVote>}
   */
  public createVote(currentUser: IUser, retroId: string, topicId: string, commentId: string): Promise<IPersistedRetrospectiveVote> {
    return new Promise<IPersistedRetrospectiveVote>((resolve, reject) => {
      this.doCommentAction(currentUser, retroId, topicId, commentId, (error, pRetrospective, pTopic, pComment, pUser) => {
        if (error) {
          reject(error);
        } else {
          if (!pComment.votes || pComment.votes.findIndex((v) => v.author.equals(pUser._id)) >= 0) {
            reject('User has already voted');
          } else {
            if (!RetrospectiveService.canVote(pRetrospective, pUser)) {
              reject('User not allowed to vote. Most probably retro has changed its status.');
            } else {
              let newVote = new PersistedRetrospectiveVote(pUser._id);
              pComment.votes.push(newVote);
              pRetrospective.save();
              resolve(newVote);
            }
          }
        }
      });
    });
  }

  /**
   * Delete a vote.
   *
   * @param currentUser the current user
   * @param retroId the retrospective id to which the comment belongs to
   * @param topicId the topic to which the comemnt belongs to
   * @param commentId the comment id to which the vote should be removed
   * @returns {Promise<void>}
   */
  public deleteVote(currentUser: IUser, retroId: string, topicId: string, commentId: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.doCommentAction(currentUser, retroId, topicId, commentId, (error, pRetrospective, pTopic, pComment, pUser) => {
        if (error) {
          reject(error);
        } else {
          if (!pComment.votes) {
            reject('No votes found');
          } else {
            let lengthBefore = pComment.votes.length;
            pComment.votes = pComment.votes.filter((v) => !v.author.equals(pUser._id));
            if (pComment.votes.length === lengthBefore) {
              reject('No vote from user ' + pUser.uuid + ' found');
            } else {
              if (!RetrospectiveService.canVote(pRetrospective, pUser)) {
                reject('User not allowed to delete vote. Most probably retro has changed its status.');
              } else {
                pRetrospective.save();
                resolve();
              }
            }
          }
        }
      });
    });
  }

  private doRetrospectiveAction(currentUser: IUser, retroId: string,
                                action: (error: any, retro?: IPersistedRetrospectiveDbModel, user?: IUserDbModel) => void): void {
    this.retrospectiveRepository.findByUuid(retroId, (retrospectiveLoadError, persistedRetrospective) => {
      if (retrospectiveLoadError) {
        action(retrospectiveLoadError);
      } else if (!persistedRetrospective) {
        action('Persisted retrospective not found');
      } else {
        this.userRepository.findByUuid(currentUser.uuid, (userLoadError, persistedUser) => {
          if (userLoadError) {
            action(userLoadError);
          } else if (!persistedUser) {
            action('Persisted user not found');
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
            return attendeeId.equals(persistedUser._id);
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
        } else {
          action(null, persistedRetrospective, persistedTopic, comment, persistedUser);
        }
      }
    });
  }

}
