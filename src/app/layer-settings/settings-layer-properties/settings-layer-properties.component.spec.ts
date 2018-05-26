import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLayerPropertiesComponent } from './settings-layer-properties.component';

describe('SettingsLayerPropertiesComponent', () => {
  let component: SettingsLayerPropertiesComponent;
  let fixture: ComponentFixture<SettingsLayerPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
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
