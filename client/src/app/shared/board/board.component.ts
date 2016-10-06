import {Component, OnInit, Input, Directive} from '@angular/core';

@Component({
  selector: 'rsb-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
  constructor() {
  }

  ngOnInit() {
  }

}

/**
 * Title of the Board
 */
@Directive({
  selector: 'rsb-board-title'
})
export class BoardTitle {}

/**
 * Buttons in Buttonset of the Board
 */
@Directive({
  selector: 'rsb-board-buttons'
})
export class BoardButtons {}

/**
 * Content of the Body part of the Board
 */
@Directive({
  selector: 'rsb-board-body'
})
export class BoardBody {}
