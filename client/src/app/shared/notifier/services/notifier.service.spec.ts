/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NotifierService } from './notifier.service';

describe('NotifierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotifierService]
    });
  });

  it('should ...', inject([NotifierService], (service: NotifierService) => {
    expect(service).toBeTruthy();
  }));
});
