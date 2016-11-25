import {Component, OnInit, Input} from '@angular/core';
import {IBasicRetrospectiveComment, IRetrospectiveUser} from '../../../shared/model';
import {IconButtonType} from '../../../shared/';

@Component({
  selector: 'rsb-comment-segment',
  templateUrl: 'comment-segment.component.html',
  styleUrls: ['comment-segment.component.css']
})
export class CommentSegmentComponent implements OnInit {

  public iconButtonType = IconButtonType;

  @Input()
  public comments: IBasicRetrospectiveComment<IRetrospectiveUser>[];

  constructor() {
  }

  ngOnInit() {
  }


  public get hasComments(): boolean {
    return this.comments != null && this.comments.length > 0;
  }

}
