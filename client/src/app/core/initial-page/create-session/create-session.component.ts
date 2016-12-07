import {Component, OnInit} from '@angular/core';
import {IconButtonType, AuthenticationService} from '../../../shared';
import {Router, ActivatedRoute} from '@angular/router';
import {RetrospectiveService} from '../../services';
import {NotifierService} from '../../../shared/notifier/notifier.service';
import {NotificationMessage} from '../../../shared/notification-message/notification-message';
import {NotificationMessageType} from '../../../shared/notification-message/notification-message-type';

@Component({
  selector: 'rsb-create-session',
  templateUrl: 'create-session.component.html',
  styleUrls: ['create-session.component.css']
})
export class CreateSessionComponent implements OnInit {
  public iconButtonType = IconButtonType;

  // Fields
  public sessionTitle: string = null;
  public sessionDesc: string = null;
  public shortName: string = null;
  public validationErrorMessage: NotificationMessage;
  public sessionTitleErrorMessage: string = null;
  public sessionDescErrorMessage: string = null;
  public shortNameErrorMessage: string = null;

  private _waitForCreateSession: boolean = false;

  constructor(private authService: AuthenticationService,
              private retrospectiveService: RetrospectiveService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotifierService) {
  }

  ngOnInit() {
  }

  public createSession() {
    if (!this._waitForCreateSession && this.inputValidation()) {
      this.retrospectiveService.createRetrospective(this.sessionTitle, this.sessionDesc, this.shortName).subscribe(sessionKey => {
          console.log('new SessionKey is: ' + sessionKey);
          this.router.navigate([sessionKey], {relativeTo: this.route});
          this._waitForCreateSession = false;
        },
        e => {
          console.log(e);
          this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.ERROR,
            'There was a error while trying to create a new retrospective session on the Server.', 10));
          this._waitForCreateSession = false;
        });
    }
  }

  public get isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }


  public inputValidation(): boolean {
    this.sessionTitleErrorMessage = this.sessionTitle != null ? null : 'Title for Retrospective is a requierd field';
    this.sessionDescErrorMessage = this.sessionDesc != null ? null : 'Description of Retrospective is a requierd field';
    this.shortNameErrorMessage = this.shortName != null ? null : 'Shortname is a requierd field';

    if (this.sessionTitleErrorMessage != null
      || this.sessionDescErrorMessage != null
      || (this.shortNameErrorMessage != null && !this.isUserLoggedIn)) {
      this.validationErrorMessage = new NotificationMessage(NotificationMessageType.WARNING, 'There are some validation errors.');
      this.notificationService.pushNextMessage(this.validationErrorMessage);
      return false;
    }

    if (this.validationErrorMessage != null) {
      this.validationErrorMessage.setMessageExpired();
    }
    return true;
  }
}
