#Icon Button Component
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

##Structure
There is no real structure to the button component. 

Imported is to understand that the button-types are saved in a extra class and can be access from there. Because of the way templates are rendered in angular 2 the _ButtonIconTypes_ class type does not be accessible per default in in the template. By adding the class to the component scope by defining a variable for the class you can access it in the template.
```typeScript
private iconButtonType = IconButtonType;
```

###ButtonTypes

####Simple Buttons
* NONE (No Icon)
* ADD (Plus)
* ABOARD (X)
* DELETE (Trashcan)
* EDIT (Pencil)
* CHECK_MARK (Check mark)
* ARROW_UP (Triangle up)
* ARROW_DOWN (Triangle down)
* ARROW_LEFT (Triangle left)
* ARROW_RIGHT (Triangle right)
* VOTE (Thump up)

####Toggle Buttons
* COLLAPSIBLE (Triangle up / Triangle down)

##Examples
```html
<!--Simple Button-->
<rsb-icon-button [buttonType]="iconButtonType.CHECK_MARK" (click)="simpleClick()"></rsb-icon-button>

<!--With Label-->
<rsb-icon-button [buttonType]="iconButtonType.ADD" [lableText]="Click Me" (click)="labelClicked()"></rsb-icon-button>

<!--Define ID-->
<rsb-icon-button [buttonType]="iconButtonType.EDIT" [htmluid]="'edit-button-id'"></rsb-icon-button>

<!--Active Button-->
<rsb-icon-button [buttonType]="iconButtonType.VOTE" [activated]="true"></rsb-icon-button>
```




