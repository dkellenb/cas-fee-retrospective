/* tslint:disable:no-unused-variable */

import {TestBed, async} from '@angular/core/testing';
import {DisableElementDirective} from './disable-element.directive';
import {ElementRef} from '@angular/core';

describe('DisableElementDirective', () => {
  it('should create an instance', () => {
    let directive = new DisableElementDirective(new DummyButtonElementRef(), null, null);
    expect(directive).toBeTruthy();
  });
});

class DummyButtonElementRef extends ElementRef {
  constructor() {
    super({
      tagName: 'BUTTON'
    });
  }
}
