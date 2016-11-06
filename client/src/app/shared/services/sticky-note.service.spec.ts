/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { StickyNoteService } from './sticky-note.service';

describe('Service: StickyNote', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StickyNoteService]
    });
  });

  it('should ...', inject([StickyNoteService], (service: StickyNoteService) => {
    expect(service).toBeTruthy();
  }));
});
