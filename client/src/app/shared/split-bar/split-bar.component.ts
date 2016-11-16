import {Component, OnInit, Directive} from '@angular/core';

@Component({
  selector: 'rsb-split-bar',
  templateUrl: './split-bar.component.html',
  styleUrls: ['./split-bar.component.css']
})
export class SplitBarComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }
}

/**
 * Content for the right Container of the Split-Bar
 */
@Directive({
  selector: 'rsb-split-bar-container-left'
})
export class SplitBarContainerLeftDirective {
}

/**
 * Content for the right Container of the Split-Bar
 */
@Directive({
  selector: 'rsb-split-bar-container-right'
})
export class SplitBarContainerRightDirective {
}
