#Carousel Component
Create a carousel for any childnodes with the rsbCarouselElement. Ideal is to have elements the same size. (is not necessary but looks better)
The carousel can be navigated with the two arrow buttons on the side or by clicking on a element in the back.
If there is just one element the navigation will not be present.
Elements in the back will be disabled or set to not selectable if marked with the attribute directive rsbDisableElement.

##Inputfields

| Parameter       | Type    | Default | Description                                                                                                                                       |
|-----------------|---------|---------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| range           | number  | 25      | Define the range in % witch will be used for the left and right side to stack the elements in the back                                            |
| carouselActive  | boolean | true    | the carousel can be deactivated with this flag. All elements will be positioned like in a div. there will be no classes applied to the elements.  |
| fixedNavButtons | boolean | false   | if true the navigation arrows wil be locked in the vertical middle of the viewport.                                                               |

##Structure
The Carousel has 3 elements
* rsb-carousel -> create the main element for the carousel.
* rsbCarouselElement -> the carousel main component is looking for this attribute directive and will order them in the carousel view.
* [rsbDisableElement](../disable-element) -> this attribute directive will label all elements that should not be active if a rsbCarouselElement is not the front element.


##Examples
### Simple carousel
```html
<rsb-carousel>
  <img src="apple.jpg" width="200px" rsbCarouselElement>
  <img src="pinapple.jpg" width="200px" rsbCarouselElement>
  <img src="orange.jpg" width="200px" rsbCarouselElement>
</rsb-carousel>
```

### Complex carousel
```html
<rsb-carousel [range]="20" [carouselActive]="isCarouselAktive" [fixedNavButtons]="true">
  <div *ngFor="let element of elements" class="myElement" rsbCarouselElement>
    <form>
      <label for="myText_{{element.name}}">Your Text</label>
      <input id="myText_{{element.name}}" type="text" rsbDisableElement>
      <button type="submit" rsbDisableElement></button>
    </form>
  </div>
</rsb-carousel>
```




