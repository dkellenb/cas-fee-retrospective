/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DisableService } from './disable.service';

describe('DisableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DisableService]
    });
  });

  it('should ...', inject([DisableService], (service: DisableService) => {
    expect(service).toBeTruthy();
  }));
});
