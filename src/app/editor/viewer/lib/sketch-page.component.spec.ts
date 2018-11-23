import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchPageComponent } from './sketch-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { By } from '@angular/platform-browser';
import { getFrameMock } from './sketch-layer.component.mock';
import { UiState } from 'src/app/core/state';
import { PageState } from 'src/app/core/state/page.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('SketchPageComponent', () => {
  let component: SketchPageComponent;
  let fixture: ComponentFixture<SketchPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [NgxsModule.forRoot([UiState, PageState]), MatSnackBarModule],
      declarations: [SketchPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchPageComponent);
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
