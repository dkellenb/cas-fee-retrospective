#Text Input Component
Create a text inputfield or textarea with label and error message if needed.

##Inputfields
| Parameter         | Type    | Default | Description                                                                                      |
|-------------------|---------|---------|--------------------------------------------------------------------------------------------------|
| id                | string  | null    | Defines the html id. If no id is set there will be one generated for linking labels with field.  |
| labelText         | string  | null    | Defines the Label text. This attribute is required.                                              |
| inputErrorMessage | string  | null    | If present the flied will show a error message and will have a red border.                       |
| isTextArea        | boolean | false   | On default there is a input of type text, if true there is a textarea instead                    |
| isRequierd        | boolean | false   | Defines if a input is required. If true there will be added a star to the label.                 |
| hideLabel         | boolean | false   | If true the Label and ErrorMessage will be hidden. (Still present in the dom)                    |
| value             | string  | null    | Set the value of the field                                                                       |

##Structure
There are 3 Parts for a _TextInputComponent_

* Input (Input field or TextArea)
* Label (Label for the input)
* ErrorMessge (Also a Label but for display the ErrorMessage)

The _TextInputComponent_ implements the _ControlValueAccessor_ so it is possible to access the value through `[(ngModel)]`

##Examples
```html
 <rsb-text-input [labelText]="'Please insert Text'" [(ngModel)]="myValue" ></rsb-text-input>

<!--Complex example-->
 <rsb-text-input [labelText]="'Sticky-Note Description'"
                 [isRequierd]="true"
                 [(ngModel)]="stickyNote.description"
                 [isTextArea]="true"
                 [hideLabel]="true"
                 [inputErrorMessage]="descError"></rsb-text-input>
```




