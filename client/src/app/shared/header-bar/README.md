#Form Component
Create a header bar container. Show the user status at the far right.

##Inputfields
there are no inputfields

##Structure
The form component has 3 elements

* rsb-header-bar
* rsb-header-bar-title
* rsb-header-bar-menu

###rsb-header-bar
Create header bar it self. use the component [user-status](../user-status) for showing the username and logout.

###rsb-header-bar-title
defines the text in the h1 section of the bar.
 
###rsb-header-bar-menu
This directive can be used to insert parts before the user-status component at the right side. for example for other links

##Examples
### Simple carousel
```html
<rsb-header-bar>
  <rsb-header-bar-title>This is a Example</rsb-header-bar-title>
  <rsb-header-bar-menu>
    <ul class="menu-bar">
      <li class="menu-bar__item"><a href="about-us.html">About us</a></li>
      <li class="menu-bar__item"><a href="help.html">Help</a></li>
    </ul>
  </rsb-header-bar-menu>
</rsb-header-bar>
```



