import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { XStore } from '../../../../core/state/state.mock';
import { SettingsLayerColorsComponent } from './settings-layer-colors.component';

describe('SettingsLayerColorsComponent', () => {
  let component: SettingsLayerColorsComponent;
  let fixture: ComponentFixture<SettingsLayerColorsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          MatMenuModule,
          NgxsModule.forRoot([XStore]),
          TranslateModule.forRoot(),
        ],
        declarations: [SettingsLayerColorsComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLayerColorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
