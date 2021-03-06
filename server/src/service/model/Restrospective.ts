import {RetrospectiveUser} from './User';
import {RetrospectiveStatus, IBasicRetrospective, IBasicRetrospectiveTopic,
        IBasicRetrospectiveComment, IBasicRetrospectiveVote} from '../../../../client/src/app/shared/model';
import {IPopulatedRetrospective, IPersistedUser} from '../../repository/model';

export class PublicRetrospective implements IBasicRetrospective<RetrospectiveUser> {
  uuid: string;
  name: string;
  description?: string;
  status: RetrospectiveStatus;
  attendees: RetrospectiveUser[];
  topics: IBasicRetrospectiveTopic<RetrospectiveUser>[];

  public static fromRetrospective(populatedRetrospective: IPopulatedRetrospective): PublicRetrospective {
    let retrospective = new PublicRetrospective();
    retrospective.uuid = populatedRetrospective.uuid;
    retrospective.name = populatedRetrospective.name;
    retrospective.description = populatedRetrospective.description;
    retrospective.status = populatedRetrospective.status;
    retrospective.attendees = populatedRetrospective.attendees.map(
      (attendee) => RetrospectiveUser.fromRetrospective(attendee, populatedRetrospective.manager));
    retrospective.topics = populatedRetrospective.topics.map(
      (topics) => PublicRetrospectiveTopic.fromRetrospective(topics));
    return retrospective;
  }

}

export class PublicRetrospectiveTopic implements IBasicRetrospectiveTopic<RetrospectiveUser> {
  uuid: string;
  name: string;
  comments: IBasicRetrospectiveComment<RetrospectiveUser>[];

  public static fromRetrospective(populatedTopic: IBasicRetrospectiveTopic<IPersistedUser>): PublicRetrospectiveTopic {
    let topic = new PublicRetrospectiveTopic();
    topic.uuid = populatedTopic.uuid;
    topic.name = populatedTopic.name;
    topic.comments = populatedTopic.comments.map((comment) => PublicRetrospectiveComment.fromRetrospective(comment, populatedTopic));
    return topic;
  }
}

export class PublicRetrospectiveComment implements IBasicRetrospectiveComment<RetrospectiveUser> {
  uuid: string;
  title: string;
  description: string;
  anonymous: boolean;
  author: RetrospectiveUser;
  topicUuid?: string;
  votes: IBasicRetrospectiveVote<RetrospectiveUser>[];

  public static fromRetrospective(populatedRetrospectiveComment: IBasicRetrospectiveComment<IPersistedUser>,
                                  populatedTopic?: IBasicRetrospectiveTopic<IPersistedUser>): PublicRetrospectiveComment {
    let comment = new PublicRetrospectiveComment();
    comment.uuid = populatedRetrospectiveComment.uuid;
    comment.title = populatedRetrospectiveComment.title;
    comment.description = populatedRetrospectiveComment.description;
    comment.anonymous = populatedRetrospectiveComment.anonymous;
    comment.author = RetrospectiveUser.fromRetrospective(populatedRetrospectiveComment.author);
    comment.votes = populatedRetrospectiveComment.votes.map((vote) => PublicRetrospectiveVote.fromRetrospective(vote));
    comment.topicUuid = populatedTopic.uuid;
    return comment;
  }
}

export class PublicRetrospectiveVote implements IBasicRetrospectiveVote<RetrospectiveUser> {
  uuid: string;
  author: RetrospectiveUser;
  value: number;

  public static fromRetrospective(populatedVote: IBasicRetrospectiveVote<IPersistedUser>): PublicRetrospectiveVote {
    let vote = new PublicRetrospectiveVote();
    vote.uuid = populatedVote.uuid;
    vote.author = RetrospectiveUser.fromRetrospective(populatedVote.author);
    vote.value = populatedVote.value;
    return vote;
  }
}
