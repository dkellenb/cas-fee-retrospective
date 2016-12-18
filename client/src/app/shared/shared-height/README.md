#Shared Height Directive and Service
With the rsbSharedHeight directive and the _SharedHeightService_ it is possible to share the height between nodes in the dom so that all nodes has the height of the larges element.
Normal this problem happens if components are not in the same flow or absolute positioned.

##Inputfields
There are no inputs on the directive or service. 

##Structure
There are to main elements to the disable-element composition

* SharedHeightService 
* SharedHeightDirective 
 
### SharedHeightService
The service has to be provided at the component who wants to share heights between elements. The service look witch element has the biggest height and will send this height to all interested (subscribed) directives. 

### SharedHeightDirective
This directive will add a min-height style on its nativeElement if the height is not the same of the current shared height. Else there will be no effect on the element.
Elements can grow or shrink when ever they want the directive will automatically send a update through the service to the rest of the shared height components. (Shrinking can just be triggered by the larges element)
##Examples

### Component
```typescript
import {Component} from '@angular/core';
import {SharedHeight} from '../../shared/sharedHeight/shared-height.class';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css'],
  providers: [SharedHeight]
})
export class SampleComponent {

}
```

### Template
```html
<div>
  <div rsbSharedHeight style="position: absolute">
    <p>some text here</p>
  </div>
  <div rsbSharedHeight style="position: absolute">
    <img src="tree.jpg">
  </div>
  <div rsbSharedHeight style="position: absolute">
    <!--nothing in here-->
  </div>
</div>
```



