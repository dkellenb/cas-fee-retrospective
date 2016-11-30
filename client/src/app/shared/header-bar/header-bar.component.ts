import {Component, OnInit, Directive} from '@angular/core';

@Component({
  selector: 'rsb-header-bar',
  templateUrl: './header-bar.component.html',
  styleUrls: ['./header-bar.component.scss']
})
export class HeaderBarComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}

/**
 * Title of the Board
 */
@Directive({
  selector: 'rsb-header-bar-title'
})
export class HeaderBarTitleDirective {
}

/**
 * Buttons in Buttonset of the Board
 */
@Directive({
  selector: 'rsb-header-bar-menu'
})
export class HeaderBarMenuDirective {
}


