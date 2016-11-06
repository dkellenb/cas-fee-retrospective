import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IRetrospectiveComment} from '../../../../../shared/src/model/retrospective/RetrospectiveDomainModel';

@Injectable()
export class StickyNoteService {

  constructor() {
  }


  public registerForNewComment(noteType: string): Observable<IRetrospectiveComment> {
    return Observable.timer(
      0, 1000).map(event=>{return <IRetrospectiveComment>{};});
  }
}
