#Notifier Component
Create a component who is able to display NotificationMessage from a queue.  

##Inputfields
| Parameter | Type                | Default | Description                  |
|-----------|---------------------|---------|------------------------------|
| message   | NotificationMessage | null    | Message which is for display |

##Structure
Simple output of the message in combination of the icons and colors for the severity

###severities
* error
* warning
* sucess
* info

the severity is taken out of the given _NotificationMessage_ class.

##Examples
### Simple carousel
```html
<rsb-notification-message [message]="message"></rsb-notification-message>
```




