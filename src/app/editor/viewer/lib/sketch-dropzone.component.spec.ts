import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SketchService } from './sketch.service';
import { SketchDropzoneComponent } from './sketch-dropzone.component';
import { HttpClientModule } from '@angular/common/http';
import { UiState } from 'src/app/core/state';
import { PageState } from 'src/app/core/state/page.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { getDataTransfertMock } from './sketch-dropzone.component.mock';

describe('SketchDropZone', () => {
  let component: SketchDropzoneComponent;
  let fixture: ComponentFixture<SketchDropzoneComponent>;
  let mockDataTransfert: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, PageState]),
        MatSnackBarModule,
        HttpClientModule
      ],
      providers: [
        SketchService
      ],
      declarations: [SketchDropzoneComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchDropzoneComponent);
    component = fixture.componentInstance;
    mockDataTransfert = getDataTransfertMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit file change', (done: DoneFn) => {
    component.changed.subscribe((element) => {
      expect(element).toEqual(mockDataTransfert.dataTransfer.items[0].getAsFile());
      done();
    });
    component.onFileDrop(mockDataTransfert);
  });
});
