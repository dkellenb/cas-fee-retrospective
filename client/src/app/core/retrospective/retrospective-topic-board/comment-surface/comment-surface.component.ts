import {Component, OnInit, Input} from '@angular/core';
import {ToPromiseSignature} from 'rxjs/operator/toPromise';
import {TopicService} from '../services/topic.service';
import {RetrospectiveStatus} from '../../../../shared/model/RetrospectiveDomainModel';

@Component({
  selector: 'rsb-comment-surface',
  templateUrl: './comment-surface.component.html',
  styleUrls: ['./comment-surface.component.css']
})
export class CommentSurfaceComponent implements OnInit {

  @Input()
  private mode: RetrospectiveStatus;

  constructor(private topicService: TopicService) {
  }

  ngOnInit() {
  }

}
