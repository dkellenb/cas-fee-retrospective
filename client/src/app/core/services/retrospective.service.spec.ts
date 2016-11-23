/* tslint:disable:no-unused-variable */

import {TestBed, async, inject} from '@angular/core/testing';
import {RetrospectiveService} from './retrospective.service';

describe('Service: Retrospective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RetrospectiveService]
    });
  });

  it('should ...', inject([RetrospectiveService], (service: RetrospectiveService) => {
    expect(service).toBeTruthy();
  }));
});
