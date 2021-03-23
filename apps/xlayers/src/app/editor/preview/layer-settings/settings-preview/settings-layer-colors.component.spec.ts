import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { XStore } from '../../../../core/state/state.mock';
import { SettingsPreviewComponent } from './settings-preview.component';

describe('SettingsPreviewComponent', () => {
  let component: SettingsPreviewComponent;
  let fixture: ComponentFixture<SettingsPreviewComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          MatMenuModule,
          NgxsModule.forRoot([XStore]),
          TranslateModule.forRoot(),
        ],
        declarations: [SettingsPreviewComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
