import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {IBasicRetrospective, IRetrospectiveUser} from '../../shared/model';
import {RetrospectiveService} from '../services/retrospective.service';
import {IconButtonType} from '../../shared/icon-button/icon-button-type';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {UserRole} from '../../shared/model/UserDomainModel';
import {RetrospectiveStatus} from '../../shared/model/RetrospectiveDomainModel';
import {ScreenSizeService} from '../../shared/services/screen-size.service';

@Component({
  selector: 'rsb-retrospective',
  templateUrl: './retrospective.component.html',
  styleUrls: ['./retrospective.component.scss']
})
export class RetrospectiveComponent implements OnInit {

  public iconButtonType = IconButtonType;

  private _retrospective: IBasicRetrospective<IRetrospectiveUser>;

  private retroId: string;

  constructor(private route: ActivatedRoute,
              private retrospectiveService: RetrospectiveService,
              private router: Router,
              private authService: AuthenticationService,
              private scrennSizeService: ScreenSizeService) {
  }

  ngOnInit() {
    this.route.params.switchMap((params: Params) => {
      this.retroId = params['id'];
      return this.retrospectiveService.joinRetrospective(this.retroId);
    })
      .flatMap((sucess: boolean) => {
        if (sucess) {
          return this.retrospectiveService.getRetrospective(this.retroId);
        }
        throw Error('Wasn\'t able to join retrospective');
      })
      .first()
      .subscribe((retrospective: IBasicRetrospective<IRetrospectiveUser>) => {
        this._retrospective = retrospective;
        console.log('load Retrospective with UUID: ' + this._retrospective.uuid);
      }, e => {
        console.log('Wasn\'t able to find Retrospective: ' + this.retroId);
        this.retrospectiveService.failedRetrospectiveId = this.retroId;
        this.router.navigate(['']);
      });
  }

  public get hasManagerRole(): boolean {
    if (this._retrospective == null) {
      return false;
    }
    let loggedInUserUUID: string = this.authService.getLoggedInUser().uuid;
    let currendUser: IRetrospectiveUser = this._retrospective.attendees.find((user: IRetrospectiveUser) => {
      return user.uuid === loggedInUserUUID;
    });
    return currendUser != null && (currendUser.role === UserRole.MANAGER || currendUser.role === UserRole.ADMIN);
  }

  public get isClosed(): boolean {
    return this.retrospectiveService != null && this._retrospective.status === RetrospectiveStatus.CLOSED;
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
    return this._retrospective.status != null ?
      this._retrospective.status === RetrospectiveStatus.OPEN ? 'Start review of comments'
        : this._retrospective.status === RetrospectiveStatus.CLOSED ? ''
        : this._retrospective.status === RetrospectiveStatus.GROUP ? 'Start voting'
        : this._retrospective.status === RetrospectiveStatus.REVIEW ? 'Start voting'
        : this._retrospective.status === RetrospectiveStatus.VOTE ? 'Show votingresult'
        : '' : '';
  }

  private getNextStatus(): RetrospectiveStatus {
    return this._retrospective.status != null ?
      this._retrospective.status === RetrospectiveStatus.OPEN ? RetrospectiveStatus.REVIEW
        : this._retrospective.status === RetrospectiveStatus.REVIEW ? RetrospectiveStatus.VOTE
        : this._retrospective.status === RetrospectiveStatus.GROUP ? RetrospectiveStatus.VOTE
        : this._retrospective.status === RetrospectiveStatus.VOTE ? RetrospectiveStatus.CLOSED
        : this._retrospective.status === RetrospectiveStatus.CLOSED ? null
        : null : null;
  }

  public get retrospective(): IBasicRetrospective<IRetrospectiveUser> {
    this.retrospectiveService.getRetrospective(this.retroId)
      .first()
      .subscribe((retrospective: IBasicRetrospective<IRetrospectiveUser>) => {
        this._retrospective = retrospective;
      });
    return this._retrospective;
  }


  public isCarouselAktive(): boolean {
    return this.retrospective != null && this.retrospective.status !== RetrospectiveStatus.OPEN && !this.scrennSizeService.isSmaleScreen;
  }
}
