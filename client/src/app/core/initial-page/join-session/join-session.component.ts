import {Component, OnInit} from '@angular/core';
import {IconButtonType, AuthenticationService} from '../../../shared';
import {Router, ActivatedRoute} from '@angular/router';
import {RetrospectiveService} from '../../services';

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
    this.retrospectiveService.joinRetrospective(this.sessionKey.trim(), this.shortName).subscribe(sucess => {
      if (sucess) {
        this.router.navigate([this.sessionKey.trim()], {relativeTo: this.route});
      }
    });
  }

  public get isUserLoggedIn(): boolean {
    return this.authService.isUserLoggedIn();
  }

}
