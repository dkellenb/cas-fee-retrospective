import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {IBasicRetrospective, IRetrospectiveUser} from '../../shared/model';
import {RetrospectiveService} from '../services/retrospective.service';
import {IconButtonType} from '../../shared/icon-button/icon-button-type';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {UserRole} from '../../shared/model/UserDomainModel';
import {RetrospectiveStatus} from '../../shared/model/RetrospectiveDomainModel';

@Component({
  selector: 'rsb-retrospective',
  templateUrl: './retrospective.component.html',
  styleUrls: ['./retrospective.component.scss']
})
export class RetrospectiveComponent implements OnInit {

  public iconButtonType = IconButtonType;

  private retrospective: IBasicRetrospective<IRetrospectiveUser>;

  constructor(private route: ActivatedRoute,
              private retrospectiveService: RetrospectiveService,
              private router: Router,
              private authService: AuthenticationService) {
  }

  ngOnInit() {
    let retroId;
    this.route.params.switchMap((params: Params) => {
      retroId = params['id'];
      return this.retrospectiveService.joinRetrospective(retroId);
    })
      .flatMap((sucess: boolean) => {
        if (sucess) {
          return this.retrospectiveService.getRetrospective(retroId);
        }
        throw Error('Wasn\'t able to join retrospective');
      })
      .first()
      .subscribe((retrospective: IBasicRetrospective<IRetrospectiveUser>) => {
        this.retrospective = retrospective;
        console.log('load Retrospective with UUID: ' + this.retrospective.uuid);
      }, e => {
        console.log('Wasn\'t able to find Retrospective: ' + retroId);
        this.retrospectiveService.failedRetrospectiveId = retroId;
        this.router.navigate(['']);
      });
  }

  public get hasManagerRole(): boolean {
    if (this.retrospective == null) {
      return false;
    }
    let loggedInUserUUID: string = this.authService.getLoggedInUser().uuid;
    let currendUser: IRetrospectiveUser = this.retrospective.attendees.find((user: IRetrospectiveUser) => {
      return user.uuid === loggedInUserUUID;
    });
    return currendUser != null && (currendUser.role === UserRole.MANAGER || currendUser.role === UserRole.ADMIN);
  }

  public aktivateNextRetroPhase(): void {
    let nextStatus = this.getNextStatus();
    if (nextStatus != null) {
      this.retrospectiveService.updateRetrospectiveStatus(nextStatus)
        .first()
        .subscribe((success: boolean) => {
            console.log('Session enter next status: ' + nextStatus);
          },
          e => {
            console.log('was not able to enter next status');
          });
    }
  }

  public get retroStatecontrollerLabelText(): string {
    return this.retrospective.status != null ?
      this.retrospective.status === RetrospectiveStatus.OPEN ? 'Start review of comments'
        : this.retrospective.status === RetrospectiveStatus.CLOSED ? ''
        : this.retrospective.status === RetrospectiveStatus.GROUP ? 'Start voting'
        : this.retrospective.status === RetrospectiveStatus.REVIEW ? 'Start voting'
        : this.retrospective.status === RetrospectiveStatus.VOTE ? 'Show votingresult'
        : '' : '';
  }

  private getNextStatus(): RetrospectiveStatus {
    return this.retrospective.status != null ?
      this.retrospective.status === RetrospectiveStatus.OPEN ? RetrospectiveStatus.REVIEW
        : this.retrospective.status === RetrospectiveStatus.REVIEW ? RetrospectiveStatus.VOTE
        : this.retrospective.status === RetrospectiveStatus.GROUP ? RetrospectiveStatus.VOTE
        : this.retrospective.status === RetrospectiveStatus.VOTE ? RetrospectiveStatus.CLOSED
        : this.retrospective.status === RetrospectiveStatus.CLOSED ? null
        : null : null;
  }


}
