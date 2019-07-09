import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerPageComponent } from './page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { By } from '@angular/platform-browser';
import { getFrameMock } from '../layer/layer.component.mock';
import { UiState } from '@app/core/state';
import { CodeGenState } from '@app/core/state/page.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('ViewerPageComponent', () => {
  let component: ViewerPageComponent;
  let fixture: ComponentFixture<ViewerPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, CodeGenState]),
        MatSnackBarModule,
        HttpClientTestingModule
      ],
      declarations: [ViewerPageComponent]
    }).compileComponents();
  }));

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
      layers: Array.from(Array(3).keys()).map(index => ({
        do_objectID: `layer-${index}-id`,
        _class: 'layer',
        layers: [],
        frame: getFrameMock(index, index),
        name: `layer-${index}`
      })),
      frame: getFrameMock(824, 918),
      name: `page-layer`
    } as SketchMSPage;
    fixture.detectChanges();
    const layerElements = fixture.debugElement.queryAll(By.css('.layer'));
    expect(layerElements.length).toBe(3);
  });
});
