import {Component, OnInit} from '@angular/core';
import {IconButtonType, AuthenticationService} from '../../../shared';
import {Router, ActivatedRoute} from '@angular/router';
import {RetrospectiveService} from '../../services';
import {NotificationMessage} from '../../../shared/notification-message/notification-message';
import {NotificationMessageType} from '../../../shared/notification-message/notification-message-type';

@Component({
  selector: 'rsb-join-session',
  templateUrl: 'join-session.component.html',
  styleUrls: ['join-session.component.css']
})
export class JoinSessionComponent implements OnInit {

  public iconButtonType = IconButtonType;

  public shortName;
  public sessionKey;

  constructor(private authService: AuthenticationService,
              private retrospectiveService: RetrospectiveService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
  }

  public joinSession(): void {
    this.retrospectiveService.joinRetrospective(this.sessionKey, this.shortName).subscribe(sucess => {
      if (sucess) {
        this.router.navigate([this.sessionKey], {relativeTo: this.route});
      }
    });
  }

  public get isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }


  public get successMessage(): NotificationMessage {
    return new NotificationMessage(NotificationMessageType.SUCCESS, 'This was a Sucess');
  }
}
