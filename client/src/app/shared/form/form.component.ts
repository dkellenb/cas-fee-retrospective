import {Component, OnInit, Directive, ElementRef, Renderer, ViewChild} from '@angular/core';

@Component({
  selector: 'rsb-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}


/**
 * Content of the Body part of the Board
 */
@Directive({
  selector: 'rsb-form-body'
})
export class FormBody {}


/**
 * Content of the Body part of the Board
 */
@Directive({
  selector: 'rsb-form-submit'
})
export class FormSubmit {}


/**
 * Directiv for label a Element of the Form
 */
@Directive({
  selector: '[rsb-form-element]',
})
export class FormSetElement {
  constructor(public el: ElementRef, public renderer: Renderer) {
    renderer.setElementClass(el.nativeElement, 'form__element', true);
  }
}
