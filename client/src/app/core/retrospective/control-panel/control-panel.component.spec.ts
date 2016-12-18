/* tslint:disable:no-unused-variable */
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DebugElement} from '@angular/core';

import {ControlPanelComponent} from './control-panel.component';
import {LinebreakTextComponent} from '../../../shared/linebreak-text/linebreak-text.component';
import {UserIconComponent} from '../../../shared/user-icon/user-icon.component';
import {QRCodeComponent} from 'angular2-qrcode/angular2-qrcode';
import {RetrospectiveService} from '../../services/retrospective.service';
import {StubRetrospectiveService} from '../../services/retrospective.service.spec';
import {ScreenSizeService} from '../../../shared/services/screen-size.service';

describe('ControlPanelComponent', () => {
  let component: ControlPanelComponent;
  let fixture: ComponentFixture<ControlPanelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ControlPanelComponent,
        LinebreakTextComponent,
        UserIconComponent,
        QRCodeComponent
      ],
      providers: [
        ScreenSizeService,
        {provide: RetrospectiveService, useClass: StubRetrospectiveService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
