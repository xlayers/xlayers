import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchPageComponent } from './sketch-page.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { XStore } from '../../../core/state/state.mock';
import { By } from '@angular/platform-browser';
import { getFlatLayerMock } from './sketch-layer.component.mock';
import { UiState } from 'src/app/core/state';
import { PageState } from 'src/app/core/state/page.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('SketchPageComponent', () => {
  let component: SketchPageComponent;
  let fixture: ComponentFixture<SketchPageComponent>;
  let mockSketchMSPage: SketchMSPage;

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
    mockSketchMSPage = getFlatLayerMock(3);
    component.page = mockSketchMSPage;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should list layers', () => {
    const layerElements = fixture.debugElement.queryAll(By.css('.layer'));
    expect(layerElements.length).toBe(3);
  });
});
