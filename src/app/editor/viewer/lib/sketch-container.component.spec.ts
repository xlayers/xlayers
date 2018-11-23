import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SketchContainerComponent } from './sketch-container.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { SketchService, SketchData } from './sketch.service';
import { getSketchDataMock } from './sketch.service.mock';
import { UiState } from 'src/app/core/state';
import { PageState } from 'src/app/core/state/page.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { getFileMock } from './sketch-container.component.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('SketchContainerComponent', () => {
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
        // HttpClientModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        SketchService
      ],
      declarations: [SketchContainerComponent]
    })
      .compileComponents();
      store = TestBed.get(Store);
      sketchService = TestBed.get(SketchService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchContainerComponent);
    component = fixture.componentInstance;
    mockFile = getFileMock();
    mockSketchData = getSketchDataMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should process selected file', async() => {
    spyOn(sketchService, 'process').and.returnValue(Promise.resolve(mockSketchData));
    await component.onFileSelected(mockFile);
    expect(component.data).toBe(mockSketchData);
  });

  describe('should clear current page', () => {
    it('currentPage is truthy', async(() => {
      component.currentPage = {} as any;
      component.clearSelection();
      store.select(UiState.currentLayer).subscribe((element) => {
        expect(element).toBe(null);
      });
    }));

    it('currentPage is falsy', async(() => {
      component.currentPage = null;
      component.clearSelection();
      store.select(UiState.currentLayer).subscribe((element) => {
        expect(element).toBe(null);
      });
    }));
  });
});
