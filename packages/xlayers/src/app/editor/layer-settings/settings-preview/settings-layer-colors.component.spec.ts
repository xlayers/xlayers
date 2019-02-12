import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsPreviewComponent } from './settings-preview.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { XStore } from '@app/core/state/state.mock';
import { NgxsModule } from '@ngxs/store';
import { MatMenuModule } from '@angular/material/menu';

describe('SettingsPreviewComponent', () => {
  let component: SettingsPreviewComponent;
  let fixture: ComponentFixture<SettingsPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatMenuModule, NgxsModule.forRoot([XStore])],
      declarations: [ SettingsPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
