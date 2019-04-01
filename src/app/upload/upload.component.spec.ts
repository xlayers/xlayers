import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SketchService } from '@app/core/sketch.service';
import { getSketchDataMock } from '@app/core/sketch.service.mock';
import { UiState } from '@app/core/state';
import { Store, NgxsModule } from '@ngxs/store';
import { UploadComponent } from './upload.component';
import { getFileMock } from './upload.component.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('UploadComponent', () => {
  let component: UploadComponent;
  let fixture: ComponentFixture<UploadComponent>;
  let sketchService: SketchService;
  let store: Store;
  let mockSketchData: SketchMSData;
  let mockFile: File;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadComponent ],
      providers: [SketchService],
      imports: [NgxsModule.forRoot([]), HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
    sketchService = TestBed.get(SketchService);
    mockSketchData = getSketchDataMock();
    mockFile = getFileMock();
    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should process selected file', async () => {
    spyOn(sketchService, 'process').and.returnValue(
      Promise.resolve(mockSketchData)
    );
    await component.onFileSelected(mockFile);

    store.selectOnce(UiState.currentFile).subscribe(data => {
      expect(data).toEqual(mockSketchData);
    });
  });

});
