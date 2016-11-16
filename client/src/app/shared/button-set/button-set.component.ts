import {Component, OnInit, Directive, ElementRef, Renderer} from '@angular/core';

@Component({
  selector: 'rsb-button-set',
  templateUrl: './button-set.component.html',
  styleUrls: ['./button-set.component.css']
})
export class ButtonSetComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}


@Directive({
  selector: '[rsb-button-set-element]',
})
export class ButtonSetElementDirective {
  constructor(public el: ElementRef, public renderer: Renderer) {
    renderer.setElementClass(el.nativeElement, 'button-set_element', true);
  }
}


