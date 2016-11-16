import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'rsb-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {

  // noinspection TsLint
  private boards: Board[] = [
    new Board('Start doing'),
    new Board('Continue doing'),
    new Board('Stop doing')];

  constructor() {
  }

  ngOnInit() {
  }
}

export class Board {
  constructor(private title: string) {
  }
}


