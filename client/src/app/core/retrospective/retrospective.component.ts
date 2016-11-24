import {Component, OnInit} from '@angular/core';
import {IBasicRetrospective, IUser} from '../../shared/model';
import {ActivatedRoute, Params} from '@angular/router';
import {RetrospectiveService} from '../services/retrospective.service';

@Component({
  selector: 'rsb-retrospective',
  templateUrl: './retrospective.component.html',
  styleUrls: ['./retrospective.component.css']
})
export class RetrospectiveComponent implements OnInit {

  // noinspection TsLint
  private boardTitles: string[] = [];

  private retrospective: IBasicRetrospective<IUser>;

  constructor(private route: ActivatedRoute,
              private retrospectiveService: RetrospectiveService) {
  }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.retrospectiveService.getRetrospective(params['id']))
      .subscribe(retrospective => {
        this.retrospective = retrospective;

        this.retrospective.topics.map(topic => {
          this.boardTitles.push(topic.name);
        });
        console.log(this.retrospective);
      });
  }
}
