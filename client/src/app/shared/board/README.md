#Board Component
Displays a Rsb-Board

##Inputfields

| Parmeter       | Type    | Default | Description                                                                                                                                                             |
|----------------|---------|---------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| isOpen         | boolean | true    | Defines if board body is collapsed (true => open / false => closed)                                                                                                     |
| isCollapsible  | boolean | false   | Defines if board can be collapsible (show the arrow button at the top left corner). If the value changes from true to false the board will set isOpen automatic to true |
| collapseFooter | boolean | true    | Defines if footer will be collapsed as well if the body closes.                                                                                                         |

##Structure
the Board contains 4 sections:
* Title (rsb-board-title)
* Buttons (rsb-board-buttons)
* Body (rsb-board-body)
* Footer (rsb-board-footer)

### Title 
This section will be rendered as title at the top left of the board. (h2)

### Buttons
In this section you can add buttons (rsb-icon-buttons) to the top right of the board. If the board is collapsible there will be at the end the rsb-icon-button for collapse the board.

### Body
This section can be used like a div. Here is the main area for the content of the board.

### Footer
The footer is also like a div. Special about the footer is that it is possible to separately decide if it should be collapsed. (see input collapseFooter)

##Examples
### Simple open board
```html
<rsb-board [isCollapsible]="false">
  <rsb-board-title>Create User</rsb-board-title>
  <rsb-board-body>
    <p>here is a text in the body</p>
  </rsb-board-body>
</rsb-board>
```
### Complex open board
```html
<rsb-board [isCollapsible]="true" [isOpen]="true" [collapseFooter]=false>
  <rsb-board-title>Create User</rsb-board-title>
  <rsb-board-buttons>
      <rsb-icon-button *ngIf="showAddCommentButton" [buttonType]="iconButtonType.ADD" (click)="addComment()"></rsb-icon-button>
    </rsb-board-buttons>
  <rsb-board-body>
    <p>here is a text in the body</p>
  </rsb-board-body>
  <rsb-board-footer>
     <p>Authorname: {{author.name}}</p>
  </rsb-board-footer>
</rsb-board>
```




