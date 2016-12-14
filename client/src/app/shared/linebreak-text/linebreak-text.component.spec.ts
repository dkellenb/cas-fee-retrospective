/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LinebreakTextComponent } from './linebreak-text.component';

describe('LinebreakTextComponent', () => {
  let component: LinebreakTextComponent;
  let fixture: ComponentFixture<LinebreakTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinebreakTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinebreakTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
