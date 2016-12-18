#Notifier Component
Create a component who is able to display NotificationMessage from a queue.  

##Inputfields
there are no Inputfields

##Structure
There are 3 main components for the notifier.

* notifier
* notifier-service
* notification-message [rsb-notification-message](notification-message)

###Notifier
Show the _NotificationMessages_ in the queue from the _Notification-Service_.
If there is no message just show a empty box.

###Notifier-Service
This part is the core of the whole Notifier. 
Everyone who wish to push a message to the Notifier has to do it thought this service by calling the method _pushNextMessage_
The Service will keep track of all messages in the queue and will push the most important message to the notifier. (See _Message queue importance rule_)

####Message queue importance rule
1. By severity `Error > Warning > Success > Info`
2. By create-time `new > old`

####Provide Service
The Service self is not provided by the _Notifier_ self you have to provide the service at the place you want to be the scope for the notifier. It is not possible to use the _Notifier_ without provide the service. Normally it is the component who define use _rsb-notifier_ in the template.  

####Push NotificationMessage to the _Notifier_
To push a message to the _Notifier_ use the _NotifierService_ with the method _pushNextMessage_.
To get hold of the _NotifierService_ just inject it at the place you want to use him. 

There are two ways of Messages 

* expire by it self
* last until something set it to expired

**Example of Message who expire by it self.**
```typescript
this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.INFO,'Just a Infotext', 5))
```
the expire timer is given in seconds 

**Example of Message who will not expire**
```typescript
let message: NotificationMessage = new NotificationMessage(NotificationMessageType.ERROR,'There are input failers')
this.notificationService.pushNextMessage(message)

// somewhere else in the code
message.setMessageExpired();
```

###Notification Message
see [Notification Message](notification-message)


##Examples
###Sample Component
```typescript
import {Component} from '@angular/core';
import {NotifierService} from '../../shared/notifier/services/notifier.service';
import {NotificationMessage} from '../../shared/notifier/services/notification-message';
import {NotificationMessageType} from '../../shared/notifier/services/notification-message-type';

@Component({
  selector: 'app-sample',
  templateUrl: './sample.component.html',
  styleUrls: ['./sample.component.css'],
  providers: [NotifierService]
})
export class SampleComponent {

  private _counter: number = 0;

  constructor(private notifierService: NotifierService) {
  }

  public showMessage() {
    this._counter++;
    this.notifierService.pushNextMessage(
      new NotificationMessage(NotificationMessageType.INFO, 'Button was' + this._counter + ' times clicked', 5)
    );
  }
}
```

###Sample Template
```html
<div class="sample-comp">
  <rsb-notifier></rsb-notifier>
  <button type="button" (click)="showMessage()">Click Me</button>
</div>
```


