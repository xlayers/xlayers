import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularSketchViewerComponent } from './angular-sketch-viewer.component';

describe('AngularSketchViewerComponent', () => {
  let component: AngularSketchViewerComponent;
  let fixture: ComponentFixture<AngularSketchViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularSketchViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularSketchViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
