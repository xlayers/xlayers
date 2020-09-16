import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLayerPropertiesComponent } from './settings-layer-properties.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { TranslateModule } from '@ngx-translate/core';
import { XStore } from '../../../../core/state/state.mock';

describe('SettingsLayerPropertiesComponent', () => {
  let component: SettingsLayerPropertiesComponent;
  let fixture: ComponentFixture<SettingsLayerPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [NgxsModule.forRoot([XStore]), TranslateModule.forRoot()],
      declarations: [SettingsLayerPropertiesComponent],
    }).compileComponents();
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
