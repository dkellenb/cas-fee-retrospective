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
      transition('inactive => active', animate('100ms ease-in')),
      transition('active => inactive', animate('100ms ease-out'))
    ])
  ]
})
export class BoardComponent implements OnInit {

  private iconButtonType = IconButtonType;

  @Input()
  private isOpen: boolean = true;

  private collapsibleState: string = BoardComponent.OPEN;

  private static readonly OPEN: string = 'open';
  private static readonly CLOSE: string = 'close';

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges() {
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
