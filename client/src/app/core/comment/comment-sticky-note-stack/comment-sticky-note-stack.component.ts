import {Component, OnInit, Input} from '@angular/core';
import {StickyNoteService} from '../../../shared/services/sticky-note.service';

@Component({
  selector: 'rsb-comment-sticky-note-stack',
  templateUrl: './comment-sticky-note-stack.component.html',
  styleUrls: ['./comment-sticky-note-stack.component.css']
})
export class CommentStickyNoteStackComponent implements OnInit {

  @Input()
  private eventName: string;

  private countEvent: number = 0;

  private stickyNoteService: StickyNoteService;


  constructor(stickyNoteService: StickyNoteService) {
    this.stickyNoteService = stickyNoteService;
  }

  ngOnInit() {
    this.stickyNoteService.registerForNewComment(this.eventName).subscribe(stickyNote => {
      this.countEvent++;
    });
  }


}
