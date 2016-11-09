import {Component, OnInit, Directive, ElementRef, Renderer} from '@angular/core';

@Component({
  selector: 'rsb-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {
  }

}


/**
 * Content of the Body part of the Board
 */
@Directive({
  selector: 'rsb-form-body'
})
export class FormBodyDirective {
}


/**
 * Content of the Body part of the Board
 */
@Directive({
  selector: 'rsb-form-submit'
})
export class FormSubmitDirective {
}


/**
 * Directiv for label a Element of the Form
 */
@Directive({
  selector: '[rsbFormElement]',
})
export class FormSetElementDirective {
  constructor(public el: ElementRef, public renderer: Renderer) {
    renderer.setElementClass(el.nativeElement, 'form__element', true);
  }
}
