import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {IBasicRetrospectiveComment, IUser} from '../../../../../shared/src/model';

@Injectable()
export class StickyNoteService {

  constructor() {
  }


  public registerForNewComment(noteType: string): Observable<IBasicRetrospectiveComment<IUser>> {
    return Observable.timer(
      0, 1000).map(event => {
      return <IBasicRetrospectiveComment<IUser>>{};
    });
  }
}
