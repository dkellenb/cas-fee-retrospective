import {Component, OnInit, Input, Directive, trigger, state, transition, animate, style} from '@angular/core';
import {IconButtonType} from '../icon-button';

@Component({
  selector: 'rsb-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  animations: [
    trigger('collapse', [
      state('open', style({})),
      state('close', style({
        display: 'none'
      })),
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})
export class BoardComponent implements OnInit {

  private iconButtonType = IconButtonType;

  @Input()
  private collapsibleState: string = 'open';

  constructor() {
  }

  ngOnInit() {
  }

  public toggleCollapsibleState(): void {
    if (this.collapsibleState === 'open') {
      this.collapsibleState = 'close';
    } else {
      this.collapsibleState = 'open';
    }
  }

}

/**
 * Title of the Board
 */
@Directive({
  selector: 'rsb-board-title'
})
export class BoardTitle {
}

/**
 * Buttons in Buttonset of the Board
 */
@Directive({
  selector: 'rsb-board-buttons'
})
export class BoardButtons {
}

/**
 * Content of the Body part of the Board
 */
@Directive({
  selector: 'rsb-board-body'
})
export class BoardBody {
}
