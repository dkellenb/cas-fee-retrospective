import {IBasicRetrospectiveComment, IRetrospectiveUser} from '../../../../shared/model/';
import {StickyNoteMode} from './sticky-note-mode.enum';

export interface IStickyNote extends IBasicRetrospectiveComment<IRetrospectiveUser> {
  mode: StickyNoteMode;
}
