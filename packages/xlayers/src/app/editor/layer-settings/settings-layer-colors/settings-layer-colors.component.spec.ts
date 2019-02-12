import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { MatMenuModule } from '@angular/material/menu';
import { SettingsLayerColorsComponent } from './settings-layer-colors.component';
import { XStore } from '@app/core/state/state.mock';

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
