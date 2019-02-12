import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLayerPropertiesComponent } from './settings-layer-properties.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { XStore } from '@app/core/state/state.mock';
import { NgxsModule } from '@ngxs/store';

describe('SettingsLayerPropertiesComponent', () => {
  let component: SettingsLayerPropertiesComponent;
  let fixture: ComponentFixture<SettingsLayerPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [NgxsModule.forRoot([XStore])],
      declarations: [ SettingsLayerPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLayerPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
