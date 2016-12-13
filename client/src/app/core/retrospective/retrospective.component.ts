import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {IBasicRetrospective, IRetrospectiveUser} from '../../shared/model';
import {RetrospectiveService} from '../services/retrospective.service';
import {IconButtonType} from '../../shared/icon-button/icon-button-type';
import {ScreenSizeService} from '../../shared/services/screen-size.service';
import {RetrospectiveStatus} from '../../shared/model/retrospective/RetrospectiveStatus';
import {SharedHeightService} from '../../shared/sharedHeight/shared-height.service';

@Component({
  selector: 'rsb-retrospective',
  templateUrl: './retrospective.component.html',
  styleUrls: ['./retrospective.component.scss'],
  providers: [SharedHeightService]
})
export class RetrospectiveComponent implements OnInit {

  public iconButtonType = IconButtonType;


  private retroId: string;

  constructor(private route: ActivatedRoute,
              private retrospectiveService: RetrospectiveService,
              private router: Router,
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
        console.log('load Retrospective with UUID: ' + retrospective.uuid);
      }, e => {
        console.log('Wasn\'t able to find Retrospective: ' + this.retroId);
        this.retrospectiveService.failedRetrospectiveId = this.retroId;
        this.router.navigate(['']);
      });
  }

  public get hasManagerRole(): boolean {
    return this.retrospectiveService.hasManagerRole();
  }

  public get isClosed(): boolean {
    return this.retrospectiveService != null && this.retrospective.status === RetrospectiveStatus.CLOSED;
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

  public get retrospective(): IBasicRetrospective<IRetrospectiveUser> {
    return this.retrospectiveService.getCurrent();
  }


  public isCarouselAktive(): boolean {
    return this.retrospective != null && this.retrospective.status !== RetrospectiveStatus.OPEN && !this.scrennSizeService.isSmaleScreen;
  }
}
