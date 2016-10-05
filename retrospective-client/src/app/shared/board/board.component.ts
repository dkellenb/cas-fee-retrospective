import {Component, OnInit, Input, Directive} from '@angular/core';

@Component({
  selector: 'app-board',
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
  selector: 'board-title'
})
export class BoardTitle {}

/**
 * Buttons in Buttonset of the Board
 */
@Directive({
  selector: 'board-buttons'
})
export class BoardButtons {}

/**
 * Content of the Body part of the Board
 */
@Directive({
  selector: 'board-body'
})
export class BoardBody {}
