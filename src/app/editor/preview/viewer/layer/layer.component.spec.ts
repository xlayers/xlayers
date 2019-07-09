import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { UiState } from '@app/core/state';
import { CodeGenState } from '@app/core/state/page.state';
import { NgxsModule, Store } from '@ngxs/store';
import { ViewerLayerComponent } from './layer.component';
import { getFrameMock } from './layer.component.mock';

describe('ViewerLayerComponent', () => {
  let component: ViewerLayerComponent;
  let fixture: ComponentFixture<ViewerLayerComponent>;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, CodeGenState]),
        MatSnackBarModule,
        HttpClientTestingModule
      ],
      declarations: [ViewerLayerComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerLayerComponent);
    store = fixture.debugElement.injector.get(Store);
    component = fixture.componentInstance;
    component.layer = {
      do_objectID: `page-layer`,
      _class: 'page',
      layers: [
        {
          do_objectID: `layer-0-id`,
          _class: 'layer',
          layers: [],
          frame: getFrameMock(412, 422),
          name: `layer-0`
        }
      ],
      frame: getFrameMock(824, 918),
      name: `page-layer`
    } as SketchMSLayer;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should select layer', async(() => {
    store.select(UiState.currentLayer).subscribe(element => {
      if (element !== null) {
        expect(element).toEqual(component.layer);
      }
    });
    component.selectLayer(component.layer);
  }));
});
