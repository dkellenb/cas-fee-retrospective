import {Pipe, PipeTransform} from '@angular/core';
import {IBasicRetrospectiveComment, IRetrospectiveUser} from '../../../shared/model';
import {AuthenticationService} from '../../../shared';

@Pipe({
  name: 'ownComments'
})
export class OwnCommentsPipe implements PipeTransform {

  constructor(private authService: AuthenticationService) {
  }

  transform(comments: IBasicRetrospectiveComment<IRetrospectiveUser>[]): IBasicRetrospectiveComment<IRetrospectiveUser>[] {
    return comments.filter((comment: IBasicRetrospectiveComment<IRetrospectiveUser>) => {
      return comment.author.uuid === this.authService.getLoggedInUser().uuid;
    });
  }
}
