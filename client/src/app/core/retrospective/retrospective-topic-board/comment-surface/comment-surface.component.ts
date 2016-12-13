import {Component, OnInit} from '@angular/core';
import {IStickyNote, TopicService} from '../services/';
import {RetrospectiveStatus} from '../../../../shared/model/retrospective/RetrospectiveStatus';

@Component({
  selector: 'rsb-comment-surface',
  templateUrl: './comment-surface.component.html',
  styleUrls: ['./comment-surface.component.scss']
})
export class CommentSurfaceComponent implements OnInit {

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
  }

  public get comments(): IStickyNote[] {
    return this.topicService.comments;
  }

  private get isCommentStack(): boolean {
    return this.topicService.retroStatus === RetrospectiveStatus.OPEN;
  }
}
