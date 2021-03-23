import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPageComponent } from './page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { By } from '@angular/platform-browser';
import { getFrameMock } from '../layer/layer.component.mock';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UiState } from '../../../../core/state';
import { CodeGenState } from '../../../../core/state/page.state';
import { SketchMSPageLayer } from '@xlayers/sketchtypes';

describe('ViewerPageComponent', () => {
  let component: ViewerPageComponent;
  let fixture: ComponentFixture<ViewerPageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          NgxsModule.forRoot([UiState, CodeGenState]),
          MatSnackBarModule,
          HttpClientTestingModule,
        ],
        declarations: [ViewerPageComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerPageComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should list layers', () => {
    component.page = {
      do_objectID: `page-layer`,
      _class: 'page',
      layers: Array.from(Array(3).keys()).map((index) => ({
        do_objectID: `layer-${index}-id`,
        _class: 'layer',
        layers: [],
        frame: getFrameMock(index, index),
        name: `layer-${index}`,
      })),
      frame: getFrameMock(824, 918),
      name: `page-layer`,
    } as SketchMSPageLayer;
    fixture.detectChanges();
    const layerElements = fixture.debugElement.queryAll(By.css('.layer'));
    expect(layerElements.length).toBe(3);
  });
});
