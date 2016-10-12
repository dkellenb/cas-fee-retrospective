import {Component, OnInit, Input} from '@angular/core';
import {isNullOrUndefined} from 'util';

@Component({
  selector: 'rsb-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {

  @Input()
  public id: string;

  @Input()
  public labelText: string;

  @Input()
  public inputErrorMessage: string = null;

  @Input()
  public isTextArea: boolean = false; //default to textfield;

  constructor() {
  }

  ngOnInit() {
    if (this.labelText === null) {
      console.error("No Lable for TextInputComponent");
      this.inputErrorMessage="No Lable for TextInputComponent";
    }
    if (this.id === null) {
      console.error("No ID for TextInputComponent Lable->" + this.labelText);
      this.inputErrorMessage="No ID for TextInputComponent";
    }
  }

  public hasErrorMessage(): boolean {
    return this.inputErrorMessage != null;
  }

}
