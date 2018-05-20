import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxSketchViewerComponent } from './ngx-sketch-viewer.component';

describe('NgxSketchViewerComponent', () => {
  let component: NgxSketchViewerComponent;
  let fixture: ComponentFixture<NgxSketchViewerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxSketchViewerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxSketchViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
