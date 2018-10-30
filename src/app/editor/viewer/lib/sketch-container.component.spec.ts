import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchContainerComponent } from './sketch-container.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { SketchService, SketchData } from './sketch.service';
import { getSketchDataMock } from './sketch.service.mock';
import { UiState } from 'src/app/core/state';
import { PageState } from 'src/app/core/state/page.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { getFileMock } from './sketch-container.component.mock';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SketchContainerComponent', () => {
  let component: SketchContainerComponent;
  let fixture: ComponentFixture<SketchContainerComponent>;
  let sketchService: SketchService;
  let mockSketchData: SketchData;
  let mockFile: File;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, PageState]),
        MatSnackBarModule,
        HttpClientModule,
        BrowserAnimationsModule
      ],
      providers: [
        SketchService
      ],
      declarations: [SketchContainerComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchContainerComponent);
    component = fixture.componentInstance;
    sketchService = fixture.debugElement.injector.get(SketchService);
    store = fixture.debugElement.injector.get(Store);
    mockFile = getFileMock();
    mockSketchData = getSketchDataMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process selected file', (done: DoneFn) => {
    spyOn(sketchService, 'process').and.returnValue(Promise.resolve(mockSketchData));
    component.onFileSelected(mockFile);
    store.select(UiState.currentFile).subscribe((element) => {
      if (element != null) {
        expect(element).toEqual(mockSketchData);
        done();
      }
    });
  });

  it('should clear current page', () => {
    component.clearSelection();
    store.select(UiState.currentLayer).subscribe((element) => {
      expect(element).toBe(null);
    });
  });
});
