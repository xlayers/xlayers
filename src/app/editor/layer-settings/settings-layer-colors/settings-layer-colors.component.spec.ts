import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLayerColorsComponent } from './settings-layer-colors.component';

describe('SettingsLayerColorsComponent', () => {
  let component: SettingsLayerColorsComponent;
  let fixture: ComponentFixture<SettingsLayerColorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
