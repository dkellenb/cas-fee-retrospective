/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {CommentSurfaceComponent} from './comment-surface.component';
import {StickyNoteComponent} from '../sticky-note/sticky-note.component';
import {
  TextInputComponent,
  IconButtonComponent,
  ButtonSetComponent,
  LinebreakTextComponent,
  SplitBarComponent
} from '../../../../shared';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../../../shared/shared.module';
import {
  SplitBarContainerLeftDirective,
  SplitBarContainerRightDirective
} from '../../../../shared/split-bar/split-bar.component';
import {TopicService} from '../services/topic.service';
import {IStickyNote} from '../services/sticky-note.interface';


export class StubTopicService extends TopicService {

  constructor() {
    super(null, null);
  }

  public get comments(): IStickyNote[] {
    return [];
  }
}

describe('CommentSurfaceComponent', () => {
  let component: CommentSurfaceComponent;
  let fixture: ComponentFixture<CommentSurfaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        // SharedModule,
        FormsModule
      ],
      declarations: [
        CommentSurfaceComponent,
        StickyNoteComponent,
        TextInputComponent,
        IconButtonComponent,
        ButtonSetComponent,
        LinebreakTextComponent,
        SplitBarComponent,
        SplitBarContainerLeftDirective,
        SplitBarContainerRightDirective
      ],
      providers: [
        {provide: TopicService, useClass: StubTopicService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentSurfaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
