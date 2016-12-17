#Disable-Element Directive and Service
With the rsbDisableElement directive and the disableService it is possible to disable or make element not selectable deeper down the node tree.

##Inputfields
There are no inputs on the directive or service. 
There is just the method _disableSubElements_ on the Service. This method triggers the deactivation of the subelements in the node tree. 


##Structure
There are to main elements to the disable-element composition

*DisableService 
*DisableElementDirective 
 
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

##Examples
### Simple carousel
```xml
```



