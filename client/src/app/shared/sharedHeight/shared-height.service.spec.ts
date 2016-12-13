/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SharedHeightService } from './shared-height.service';

describe('SharedHeightService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SharedHeightService]
    });
  });

  it('should ...', inject([SharedHeightService], (service: SharedHeightService) => {
    expect(service).toBeTruthy();
  }));
});
