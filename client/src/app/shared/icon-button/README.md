#Icon Button Component
Create a icon button.

##Inputfields
| Parameter    | Type           | Default | Description                                                                                                                                                          |
|--------------|----------------|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| buttonType   | IconButtonType | NONE    | Define the type of the button. Use the class _IconButtonType_ to see what kind of icon buttons are available. Default is a Button without any icon or toggle effect. |
| lableText    | string         | null    | If not null the label text will be shown before the icon button.                                                                                                     |
| htmlUid      | string         | null    | The id of the button can be set by this input. If no id is set the button will generate one form him self. (is needed to link the label)                             |
| toggleStatus | boolean        | true    | defines in which toggle status the button initially starts. Can also be used to toggle the button from external.                                                     |
| activated    | boolean        | false   | If set to true the button will receive a additional class _icon-button__body_success_ which can be used for additional styling. (default is a green background)      |

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




