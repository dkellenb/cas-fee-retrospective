import {Component, OnInit} from '@angular/core';
import {IBasicRetrospective, IRetrospectiveUser} from '../../../../../shared/src/model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {IBasicRetrospective, IRetrospectiveUser} from '../../shared/model';
import {ActivatedRoute, Params} from '@angular/router';
import {RetrospectiveService} from '../services/retrospective.service';

@Component({
  selector: 'rsb-retrospective',
  templateUrl: './retrospective.component.html',
  styleUrls: ['./retrospective.component.css']
})
export class RetrospectiveComponent implements OnInit {

  private retrospective: IBasicRetrospective<IRetrospectiveUser>;

  constructor(private route: ActivatedRoute,
              private retrospectiveService: RetrospectiveService, private router: Router) {
  }

  ngOnInit() {
    this.route.params.switchMap((params: Params) => this.retrospectiveService.getRetrospective(params['id']))
      .first()
      .subscribe(retrospective => {
        this.retrospective = retrospective;
        console.log('load Retrospective with UUID: ' + this.retrospective.uuid);
      }, e => {
        console.log('Wasn\'t able to finde Retrospective');
        this.router.navigate(['']);
      });
  }
}
