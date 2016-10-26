import {Component, OnInit, Input, Directive, trigger, state, transition, animate, style} from '@angular/core';
import {IconButtonType} from '../icon-button';

@Component({
  selector: 'rsb-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
  animations: [
    trigger('collapse', [
      state(BoardComponent.OPEN, style({})),
      state(BoardComponent.CLOSE, style({
        display: 'none'
      })),
      transition('open => close', [
        style({
          height: '*',
          overflow: 'hidden'
        }),
        animate(250, style({height: 0}))
      ]),
      transition('close => open', [
        style({
          height: 0,
          overflow: 'hidden'
        }),
        animate(250, style({height: '*'}))
      ]),
    ])
  ]
})
export class BoardComponent implements OnInit {

  private iconButtonType = IconButtonType;

  @Input()
  private isOpen: boolean = true;

  @Input()
  private isCollapsible = false;

  private collapsibleState: string = BoardComponent.OPEN;

  private static readonly OPEN: string = 'open';
  private static readonly CLOSE: string = 'close';

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.isCollapsible) {
      //always open if not collapsible
      this.isOpen = true;
    }
    this.updateCollapsibleState();
  }

  public toggleCollapsibleState(): void {
    this.isOpen = !this.isOpen;
    this.updateCollapsibleState();
  }

  public updateCollapsibleState(): void {
    if (this.isOpen) {
      this.collapsibleState = BoardComponent.OPEN;
    } else {
      this.collapsibleState = BoardComponent.CLOSE;
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
