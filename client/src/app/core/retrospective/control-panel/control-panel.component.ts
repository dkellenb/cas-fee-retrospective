import {Component, OnInit, Input, Inject} from '@angular/core';
import {IBasicRetrospective, IRetrospectiveUser} from '../../../shared/model/';
import {DOCUMENT} from '@angular/platform-browser';
import {RetrospectiveService} from '../../services/retrospective.service';
import {RetrospectiveStatus} from '../../../shared/model/retrospective/RetrospectiveStatus';

@Component({
  selector: 'rsb-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['control-panel.component.scss']
})
export class ControlPanelComponent implements OnInit {

  private largeQr = false;

  constructor(private retrospectiveService: RetrospectiveService,
              @Inject(DOCUMENT) private document: any) {
  }

  private get retrospective(): IBasicRetrospective<IRetrospectiveUser> {
    return this.retrospectiveService.getCurrent();
  }

  ngOnInit() {
  }

  public get users(): IRetrospectiveUser[] {
    if (this.retrospective != null) {
      return this.retrospective.attendees;
    }
    return [];
  }

  public toggleQrSize() {
    console.log('toggle');
    this.largeQr = !this.largeQr;
  }

  public get qrSize(): number {
    if (this.largeQr) {
      return 500;
    }
    return 150;
  }

  public get hasManagerRole(): boolean {
    return this.retrospectiveService.hasManagerRole();
  }

  public get currendRoute(): string {
    return this.document.location.href;
  }

  public get passedOpenState(): boolean {
    return this.retrospective.status === RetrospectiveStatus.OPEN
      || this.passedReviewState;
  }

  public get passedReviewState(): boolean {
    return this.retrospective.status === RetrospectiveStatus.REVIEW
      || this.passedVoteState;
  }

  public get passedVoteState(): boolean {
    return this.retrospective.status === RetrospectiveStatus.VOTE
      || this.passedClosedState;
  }

  public get passedClosedState(): boolean {
    return this.retrospective.status === RetrospectiveStatus.CLOSED;
  }
}
