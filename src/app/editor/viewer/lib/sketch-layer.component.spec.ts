import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchLayerComponent } from './sketch-layer.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { ResizeEvent } from 'angular-resizable-element';
import { UiState } from '../../../core/state';
import { PageState } from '../../../core/state/page.state';
import { getFlatLayerMock, getResizeEventMock, getFrameMock } from './sketch-layer.component.mock';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('SketchLayerComponent', () => {
  let component: SketchLayerComponent;
  let fixture: ComponentFixture<SketchLayerComponent>;
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
    component.layer = {
      do_objectID: `page-layer`,
      _class: 'page',
      layers: [{
        do_objectID: `layer-0-id`,
        _class: 'layer',
        layers: [],
        frame: getFrameMock(412, 422),
        name: `layer-0`
      }],
      frame: getFrameMock(824, 918),
      name: `page-layer`
    } as SketchMSLayer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when resize', () => {
    it('should work for positive left and top', (done: DoneFn) => {
      const resizeEvent = {
        rectangle: {
          width: 238,
          height: 218,
          top: 0,
          left: 0,
          bottom: 0,
          right: 0
        },
        edges: {
          top:  917,
          left: 578,
        }
      };
      component.resizeStart(resizeEvent);
      component.resizing(resizeEvent);
      component.resizeEnd(resizeEvent);
      store.select(UiState.currentLayer).subscribe((element) => {
        expect(element.frame.x).toBe(resizeEvent.edges.left);
        expect(element.frame.y).toBe(resizeEvent.edges.top);
        done();
      });
    });

    it('should work for negative left and top', (done: DoneFn) => {
      const resizeEvent = {
        rectangle: {
          width: 45,
          height: 435
        },
        edges: {
          top:  -424,
          left: -745,
        }
      } as ResizeEvent;
      component.resizeStart(resizeEvent);
      component.resizing(resizeEvent);
      component.resizeEnd(resizeEvent);
      store.select(UiState.currentLayer).subscribe((element) => {
        expect(element.frame.x).toBe(resizeEvent.edges.left);
        expect(element.frame.y).toBe(resizeEvent.edges.top);
        done();
      });
    });
  });

  it('should select layer', (done: DoneFn) => {
    store.select(UiState.currentLayer).subscribe((element) => {
      if (element !== null) {
        expect(element).toEqual(component.layer);
        done();
      }
    });
    component.selectLayer(component.layer);
  });
});
