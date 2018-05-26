import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsLayerComponent } from './settings-layer.component';

describe('SettingsLayerComponent', () => {
  let component: SettingsLayerComponent;
  let fixture: ComponentFixture<SettingsLayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsLayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsLayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
