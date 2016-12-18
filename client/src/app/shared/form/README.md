#Form Component
Create the main container for a html form.

##Inputfields
there are no inputfields

##Structure
The form component has 4 elements
* rsb-form
* rsb-form-body
* rsb-form-submit
* rsbFormElement

###rsb-form
Create the html form tag and insert the content from the directives rsb-form-body / rsb-form-sumit at the right place.

###rsb-form-body
This directive label all the content which goes in the form. (see example)
 
###rsb-form-submit
This directive label all the elements that goes at the end of the form. normally all the buttons for the form.

###rsbFormElement
This directive labels all elements for the form (example inputfields). The directive adds the class _form__element_ to the native element of the directive. this can be used later for styling.

##Examples
### Simple carousel
```html
<rsb-form>
  <rsb-form-body>
    <div rsbFormElement>
      <label for="input_1">Text 1</label>
      <input id="input_1" type="text">
    </div>
    <div rsbFormElement>
      <label for="input_2">Text 1</label>
      <input id="input_2" type="text">
    </div>
  </rsb-form-body>
  <rsb-form-submit>
    <button type="submit" (click)="submit()">
  </rsb-form-submit>
</rsb-form>
```



