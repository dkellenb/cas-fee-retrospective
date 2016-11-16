import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from "@angular/router";
import {RetrospectiveService} from "../../shared/";
import {IBasicRetrospective, IUser} from "../../../../../shared/src/model";

@Component({
  selector: 'rsb-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {


  private retrospective: IBasicRetrospective<IUser>;

  // noinspection TsLint
  private boards: Board[] = [
    new Board('Start doing'),
    new Board('Continue doing'),
    new Board('Stop doing')];

  constructor(private route: ActivatedRoute,
              private retrospectiveService: RetrospectiveService) {
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.retrospectiveService.getRetrospective(params['id']))
      .subscribe(retrospective => {this.retrospective = retrospective});
  }
}

export class Board {
  constructor(private title: string) {
  }
}


