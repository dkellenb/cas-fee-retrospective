import {Component, OnInit} from '@angular/core';
import {IconButtonType, AuthenticationService} from '../../../shared';
import {Router, ActivatedRoute} from '@angular/router';
import {RetrospectiveService} from '../../services';
import {NotificationMessage} from '../../../shared/notifier/services/notification-message';
import {NotificationMessageType} from '../../../shared/notifier/services/notification-message-type';
import {NotifierService} from '../../../shared/notifier/services/notifier.service';

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

  private _waitForJoinSession: boolean = false;

  constructor(private authService: AuthenticationService,
              private retrospectiveService: RetrospectiveService,
              private router: Router,
              private route: ActivatedRoute,
              private notificationService: NotifierService) {
  }

  ngOnInit(): void {
    if (this.retrospectiveService.failedRetrospectiveId != null) {
      this.sessionKey = this.retrospectiveService.failedRetrospectiveId;
      if (this.isUserLoggedIn) {
        this.sessionKeyErrorMessage = 'Could not find a Retrospective-Session with this Id';
        this.validationErrorMessage = new NotificationMessage(NotificationMessageType.ERROR,
          'Could not find a Retrospective-Session with the Id:' + this.retrospectiveService.failedRetrospectiveId);
      } else {
        this.shortNameErrorMessage = 'Please insert a Shortname';
        this.validationErrorMessage = new NotificationMessage(NotificationMessageType.INFO,
          'Need a Shortname for join the Retrospective Session');
      }
      this.notificationService.pushNextMessage(this.validationErrorMessage);
    }
  }

  public joinSession(): void {
    if (!this._waitForJoinSession && this.inputValidation()) {
      this._waitForJoinSession = true;
      this.retrospectiveService.joinRetrospective(this.sessionKey.trim(), this.shortName).subscribe(sucess => {
        if (sucess) {
          this.router.navigate([this.sessionKey.trim()], {relativeTo: this.route});
        }
        this._waitForJoinSession = false;
      }, e => {
        console.log(e);
        this.notificationService.pushNextMessage(new NotificationMessage(NotificationMessageType.ERROR,
          'There was a problem with the connection to the Server', 10));
        this._waitForJoinSession = false;
      });
    }
  }

  public get isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

  public inputValidation(): boolean {
    if (this.validationErrorMessage != null) {
      this.validationErrorMessage.setMessageExpired();
    }
    this.sessionKeyErrorMessage = this.sessionKey != null ? null : 'The Retrospective-Key for join a session is a requierd field';
    this.shortNameErrorMessage = this.shortName != null ? null : 'Shortname is a requierd field';

    if (this.sessionKeyErrorMessage != null
      || (this.shortNameErrorMessage != null && !this.isUserLoggedIn)) {
      this.validationErrorMessage = new NotificationMessage(NotificationMessageType.WARNING, 'There are some validation errors.');
      this.notificationService.pushNextMessage(this.validationErrorMessage);
      return false;
    }
    return true;
  }
}
