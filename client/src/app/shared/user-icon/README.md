#User Icon Component
Create a user icon in combination with the name of the user.

##Inputfields
| Parameter         | Type                | Default | Description                                                                                      |
|-------------------|---------------------|---------|--------------------------------------------------------------------------------------------------|
| user              | IRetrospectiveUser  | null    | Information of the user who will be displayed                                                    |

##Structure
There are 3 different type of users:

* Admin (white icon with + sign)
* Manager ( white icon)
* User (black icon)

##Examples
```html
  <rsb-user-icon [user]="user"></rsb-user-icon>
```




