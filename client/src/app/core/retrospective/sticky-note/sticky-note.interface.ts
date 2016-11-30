import {IBasicRetrospectiveComment} from '../../../shared/model/RetrospectiveDomainModel';
import {IRetrospectiveUser} from '../../../shared/model/UserDomainModel';
import {StickyNoteMode} from './sticky-note-mode.enum';


export interface IStickyNote extends IBasicRetrospectiveComment<IRetrospectiveUser> {
  mode: StickyNoteMode;
}
