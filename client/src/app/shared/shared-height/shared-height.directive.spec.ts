/* tslint:disable:no-unused-variable */

import {TestBed, async} from '@angular/core/testing';
import {SharedHeightDirective} from './shared-height.directive';
import {SharedHeightService} from './shared-height.service';

describe('SharedHeightDirective', () => {
  it('should create an instance', () => {
    let directive = new SharedHeightDirective(null, null, new SharedHeightService());
    expect(directive).toBeTruthy();
  });
});
