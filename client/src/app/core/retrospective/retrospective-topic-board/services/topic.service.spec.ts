/* tslint:disable:no-unused-variable */

import {TestBed, inject} from '@angular/core/testing';
import {TopicService} from './topic.service';
import {AuthenticationService} from '../../../../shared/services/authentication.service';
import {StubRetrospectiveService} from '../../../services/retrospective.service.spec';
import {RetrospectiveService} from '../../../services/retrospective.service';

describe('Service: Topic', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TopicService,
        {provide: RetrospectiveService, useClass: StubRetrospectiveService},
        AuthenticationService]
    });
  });

  it('should ...', inject([TopicService], (service: TopicService) => {
    expect(service).toBeTruthy();
  }));
});
