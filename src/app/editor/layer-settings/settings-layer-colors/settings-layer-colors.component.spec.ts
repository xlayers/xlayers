import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLayerColorsComponent } from './settings-layer-colors.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { XStore } from '../../../core/state/state.mock';
import { NgxsModule } from '@ngxs/store';
import { MatMenuModule } from '@angular/material/menu';

import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
 // TODO: this helper should be in @angular/platform-browser-dynamic/testing
try {
  TestBed.initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting());
} catch {
  // Ignore exceptions when calling it multiple times.
}

describe('SettingsLayerColorsComponent', () => {
  let component: SettingsLayerColorsComponent;
  let fixture: ComponentFixture<SettingsLayerColorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [MatMenuModule, NgxsModule.forRoot([XStore])],
      declarations: [ SettingsLayerColorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLayerColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
