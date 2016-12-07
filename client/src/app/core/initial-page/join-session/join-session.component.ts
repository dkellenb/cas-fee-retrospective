import {Component, OnInit} from '@angular/core';
import {IconButtonType, AuthenticationService} from '../../../shared';
import {Router, ActivatedRoute} from '@angular/router';
import {RetrospectiveService} from '../../services';
import {NotificationMessage} from '../../../shared/notification-message/notification-message';
import {NotificationMessageType} from '../../../shared/notification-message/notification-message-type';
import {NotifierService} from '../../../shared/notifier/notifier.service';

@Component({
  selector: 'rsb-join-session',
  templateUrl: 'join-session.component.html',
  styleUrls: ['join-session.component.css']
})
export class JoinSessionComponent implements OnInit {

  public iconButtonType = IconButtonType;

  public shortName: string = null;
  public sessionKey: string = null;
  public validationErrorMessage: NotificationMessage = null;
  public shortNameErrorMessage: string = null;
  public sessionKeyErrorMessage: string = null;

  constructor(private authService: AuthenticationService,
              private retrospectiveService: RetrospectiveService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotifierService) {
  }

  ngOnInit(): void {
  }

  public joinSession(): void {
    if (this.inputValidation()) {
      this.retrospectiveService.joinRetrospective(this.sessionKey.trim(), this.shortName).subscribe(sucess => {
        if (sucess) {
          this.router.navigate([this.sessionKey.trim()], {relativeTo: this.route});
        }
      }, e => {
        console.log(e);
        this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.ERROR,
          'There was a problem with the connection to the Server', 10));
      });
    }
  }

  public get isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  public inputValidation(): boolean {
    this.sessionKeyErrorMessage = this.sessionKey != null ? null : 'The Retrospective-Key for join a session is a requierd field';
    this.shortNameErrorMessage = this.shortName != null ? null : 'Shortname is a requierd field';

    if (this.sessionKeyErrorMessage != null
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
