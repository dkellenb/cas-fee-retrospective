#Notification Message Component
Create a notification message for the 4 severities _error_, _warning_, _sucess_ and _info_ 

##Inputfields
| Parameter | Type                | Default | Description                  |
|-----------|---------------------|---------|------------------------------|
| message   | NotificationMessage | null    | Message which is for display |

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




