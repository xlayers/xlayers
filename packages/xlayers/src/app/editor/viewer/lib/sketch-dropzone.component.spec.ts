import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { SketchService } from './sketch.service';
import { SketchDropzoneComponent } from './sketch-dropzone.component';
import { HttpClientModule } from '@angular/common/http';
import { UiState } from '@app/core/state';
import { CodeGenState } from '@app/core/state/page.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { getDataTransfertMock } from './sketch-dropzone.component.mock';

describe('SketchDropZone', () => {
  let component: SketchDropzoneComponent;
  let fixture: ComponentFixture<SketchDropzoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, CodeGenState]),
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when drop file', () => {
    it('should emit file change', (done: DoneFn) => {
      const dataTransfer = {
        preventDefault() {},
        dataTransfer: {
          items: [{
            kind: 'file',
            getAsFile: () => ({
              name: 'mock.sketch'
            })
          }]
        }
      };
      component.changed.subscribe((element) => {
        expect(element).toEqual(dataTransfer.dataTransfer.items[0].getAsFile());
        done();
      });
      component.onFileDrop(dataTransfer);
    });

    it('should do nothing for no item', () => {
      const dataTransfer = {
        preventDefault() {},
        dataTransfer: {
          items: []
        }
      };
      spyOn<any>(component, 'removeDragData').and.stub();
      const res = component.onFileDrop(dataTransfer);
      expect(res).toEqual(undefined);
    });

    it('should fallback to file when no items', (done: DoneFn) => {
      const dataTransfer = {
        preventDefault() {},
        dataTransfer: {
          files: [{
            name: 'mock.sketch'
          }]
        }
      };
      component.changed.subscribe((element) => {
        expect(element).toEqual(dataTransfer.dataTransfer.files[0]);
        done();
      });
      component.onFileDrop(dataTransfer);
    });
  });
});
