import {Component, OnInit, Input} from '@angular/core';
import {RetrospectiveStatus} from '../../../../shared/model/RetrospectiveDomainModel';
import {IStickyNote, TopicService} from '../services/';

@Component({
  selector: 'rsb-comment-surface',
  templateUrl: './comment-surface.component.html',
  styleUrls: ['./comment-surface.component.scss']
})
export class CommentSurfaceComponent implements OnInit {

  @Input()
  private mode: RetrospectiveStatus;

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
  }

  public get comments(): IStickyNote[] {
    return this.topicService.comments;
  }

  private get isCommentStack(): boolean {
    return this.mode === RetrospectiveStatus.OPEN;
  }

}
