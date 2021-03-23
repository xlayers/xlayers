import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Store, NgxsModule } from '@ngxs/store';
import { UploadComponent } from './upload.component';
import { getFileMock } from './upload.component.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { SketchService, SketchMSData } from '../core/sketch.service';
import { getSketchDataMock } from '../core/sketch.service.mock';
import { UiState } from '../core/state';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let sketchService: SketchService;
  let store: Store;
  let mockSketchData: SketchMSData;
  let mockFile: File;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UploadComponent],
        providers: [SketchService],
        imports: [
          NgxsModule.forRoot([]),
          HttpClientTestingModule,
          RouterTestingModule.withRoutes([]),
          TranslateModule.forRoot(),
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
      sketchService = TestBed.inject(SketchService);
      mockSketchData = getSketchDataMock();
      mockFile = getFileMock();
      store = TestBed.inject(Store);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(
    'should process selected file',
    waitForAsync(async () => {
      spyOn(sketchService, 'loadSketchFile').and.returnValue(
        Promise.resolve(mockSketchData)
      );
      await component.onFileSelected(mockFile);

      store.selectOnce(UiState.currentData).subscribe((data) => {
        expect(data).toEqual(mockSketchData);
      });
    })
  );
});
