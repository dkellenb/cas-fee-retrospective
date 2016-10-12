import { Component, OnInit, Directive } from '@angular/core';

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
