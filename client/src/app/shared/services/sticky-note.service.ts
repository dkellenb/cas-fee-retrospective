import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IBasicRetrospectiveComment} from '../../../../../shared/src/model/RetrospectiveDomainModel';

@Injectable()
export class StickyNoteService {

  constructor() {
  }


  public registerForNewComment(noteType: string): Observable<IRetrospectiveComment> {
    return Observable.timer(
      0, 1000).map(event=> {
      return <IRetrospectiveComment>{};
    });
      0, 1000).map(event => { return <IBasicRetrospectiveComment>{}; });
  }
}
