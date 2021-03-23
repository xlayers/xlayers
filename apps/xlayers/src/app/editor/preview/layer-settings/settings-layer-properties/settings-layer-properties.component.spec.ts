import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { XStore } from '../../../../core/state/state.mock';

import { SettingsLayerPropertiesComponent } from './settings-layer-properties.component';

describe('SettingsLayerPropertiesComponent', () => {
  let component: SettingsLayerPropertiesComponent;
  let fixture: ComponentFixture<SettingsLayerPropertiesComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [NgxsModule.forRoot([XStore]), TranslateModule.forRoot()],
        declarations: [SettingsLayerPropertiesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLayerPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
