#Disable-Element Directive and Service
With the rsbDisableElement directive and the disableService it is possible to disable or make element not selectable deeper down the node tree.

##Inputfields
There are no inputs on the directive or service. 
There is just the method _disableSubElements_ on the Service. This method triggers the deactivation of the subelements in the node tree. 


##Structure
There are to main elements to the disable-element composition

* DisableService 
* DisableElementDirective 
 
### DisableService
Provide this service at the level from where you want to be able to disable elements down the node tree.
With the method _disableSubElements_ you can enable or disable the elements. This method can be called anywhere down the tree as long as you can inject the service. 

### DisableElementDirective
Add this directive to any Element you would like to disable. (It is necessary that a component down the tree provides the DisableService)

Elements which can be disabled with the _disabled_ attribute will be disabled with this attribute.
List of elements:
* BUTTON
* INPUT
* SELECT
* TEXTAREA
* OPTGROUP
* OPTION
* FIELDSET

All other elements will get the class _no_select_.
you can use a css like this for prevent any selection of the element.
```css
.no_select {
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none;
  cursor: default;
}
```

the _DisableService_ is a optional import, so if there is no provider for the service nothing will happen. This allows for building in hooks in a component library for later disable if needed.

##Examples

### Component
```typescript
import {Component, OnInit} from '@angular/core';
import {DisableService} from '../../shared/disable-element/disable.service';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css'],
  providers: [DisableService]
})
export class SampleComponent {

  private _toggle: boolean;

  constructor(private disableService: DisableService) {
  }

  public toggleELements() {
    this._toggle = !this._toggle;
    this.disableService.disableSubElements(this._toggle);
  }
}
```

### Template
```html
<div>
  <button type="button" (click)="toggleELements()"></button>
  <!--this could be in a other component which control the form-->
  <div>
    <form>
      <label for="myText_{{element.name}}">Your Text</label>
      <input id="myText_{{element.name}}" type="text" rsbDisableElement>
      <button type="submit" rsbDisableElement></button>
    </form>
  </div>
  <!--->
</div>
```



