import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchLayerComponent } from './sketch-layer.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { ResizeEvent } from 'angular-resizable-element';
import { UiState } from '../../../core/state';
import { PageState } from '../../../core/state/page.state';
import { getFlatLayerMock, getResizeEventMock } from './sketch-layer.component.mock';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('SketchLayerComponent', () => {
  let component: SketchLayerComponent;
  let fixture: ComponentFixture<SketchLayerComponent>;
  let mockPositiveResizeEvent: ResizeEvent;
  let mockNegativeResizeEvent: ResizeEvent;
  let mockLayer: SketchMSLayer;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [NgxsModule.forRoot([UiState, PageState]), MatSnackBarModule],
      declarations: [SketchLayerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchLayerComponent);
    store = fixture.debugElement.injector.get(Store);
    component = fixture.componentInstance;
    mockLayer = getFlatLayerMock();
    mockNegativeResizeEvent = getResizeEventMock({ positive: false });
    mockPositiveResizeEvent = getResizeEventMock();
    component.layer = mockLayer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resize in positive', (done: DoneFn) => {
    component.resizeStart(mockPositiveResizeEvent);
    component.resizing(mockPositiveResizeEvent);
    component.resizeEnd(mockPositiveResizeEvent);
    store.select(UiState.currentLayer).subscribe((element) => {
      expect(element.frame.x).toBe(mockPositiveResizeEvent.edges.left as number);
      expect(element.frame.y).toBe(mockPositiveResizeEvent.edges.top as number);
      done();
    });
    expect(component.layer.frame.x).toBe(mockPositiveResizeEvent.edges.left as number);
    expect(component.layer.frame.y).toBe(mockPositiveResizeEvent.edges.top as number);
  });

  it('should resize in negative', (done: DoneFn) => {
    component.resizeStart(mockNegativeResizeEvent);
    component.resizing(mockNegativeResizeEvent);
    component.resizeEnd(mockNegativeResizeEvent);
    store.select(UiState.currentLayer).subscribe((element) => {
      expect(element.frame.x).toBe(mockNegativeResizeEvent.edges.left as number);
      expect(element.frame.y).toBe(mockNegativeResizeEvent.edges.top as number);
      done();
    });
    expect(component.layer.frame.x).toBe(mockNegativeResizeEvent.edges.left as number);
    expect(component.layer.frame.y).toBe(mockNegativeResizeEvent.edges.top as number);
  });

  it('should select layer', (done: DoneFn) => {
    store.select(UiState.currentLayer).subscribe((element) => {
      if (element !== null) {
        expect(element).toEqual(mockLayer);
        done();
      }
    });
    component.selectLayer(mockLayer);
  });
});
