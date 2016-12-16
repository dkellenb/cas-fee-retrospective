#Board-Set Component
Container for IconButtons. Brings the IconButtons in a horizontal position to each other.  

##Inputfields
there are no input fields

##Structure
* All childnodes go direct in the container.
* The container is made for childenodes of the type [`<rsb-icon-button>`](../icon-button)

##Examples
```xml
<rsb-button-set>
  <rsb-icon-button [buttonType]="iconButtonType.CHECK_MARK" (click)="save()"></rsb-icon-button>
  <rsb-icon-button [buttonType]="iconButtonType.ABOARD" (click)="aboard()"></rsb-icon-button>
</rsb-button-set>
```

