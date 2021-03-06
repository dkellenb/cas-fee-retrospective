import {Component, OnInit, Input, forwardRef} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {UUID} from '../util/UUID';

export const TEXT_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TextInputComponent),
  multi: true
};

@Component({
  selector: 'rsb-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  providers: [TEXT_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @Input()
  public id: string;

  @Input()
  public labelText: string;

  @Input()
  public inputErrorMessage: string = null;

  @Input()
  public isTextArea: boolean = false; // default to textfield;

  @Input()
  public isRequierd: boolean = false;

  @Input()
  public hideLabel: boolean = false;

  private _value: string;
  private _onTouchedCallback;
  private _onChangeCallback;

  constructor() {
  }

  ngOnInit() {
    if (this.labelText == null) {
      console.error('No Lable for TextInputComponent');
      this.inputErrorMessage = 'No Lable for TextInputComponent';
    }
    if (this.id == null) {
      this.id = 'text-input__' + new UUID();
    }
  }

  public get hasErrorMessage(): boolean {
    return this.inputErrorMessage != null;
  }

  get value(): string {
    return this._value;
  };

  @Input() set value(v: string) {
    if (v !== this._value) {
      this._value = v;
      this._onChangeCallback(v);
    }
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  writeValue(value: any) {
    this._value = value;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnChange(fn: any) {
    this._onChangeCallback = fn;
  }

  /**
   * Implemented as part of ControlValueAccessor.
   */
  registerOnTouched(fn: any) {
    this._onTouchedCallback = fn;
  }

}
