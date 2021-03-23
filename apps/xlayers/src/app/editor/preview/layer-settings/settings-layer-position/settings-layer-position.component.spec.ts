import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { XStore } from '../../../../core/state/state.mock';
import { SettingsLayerPositionComponent } from './settings-layer-position.component';

describe('SettingsLayerPositionComponent', () => {
  let component: SettingsLayerPositionComponent;
  let fixture: ComponentFixture<SettingsLayerPositionComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [NgxsModule.forRoot([XStore]), TranslateModule.forRoot()],
        declarations: [SettingsLayerPositionComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLayerPositionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
