import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsModule } from '@ngxs/store';
import { DropzoneComponent } from './dropzone.component';
import { TranslateModule } from '@ngx-translate/core';
import { UiState } from '../../core/state';
import { CodeGenState } from '../../core/state/page.state';
import { SketchService } from '../../core/sketch.service';

describe('SketchDropZone', () => {
  let component: DropzoneComponent;
  let fixture: ComponentFixture<DropzoneComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          NgxsModule.forRoot([UiState, CodeGenState]),
          MatSnackBarModule,
          HttpClientModule,
          TranslateModule.forRoot(),
        ],
        providers: [SketchService],
        declarations: [DropzoneComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(DropzoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when drop file', () => {
    it('should emit file change', (done: Function) => {
      const dragEvent = {
        preventDefault() {},
        dataTransfer: {
          items: [
            {
              kind: 'file',
              getAsFile: () => ({
                name: 'mock.sketch',
              }),
            },
          ],
        },
      };
      component.changed.subscribe((element) => {
        expect(element).toEqual(dragEvent.dataTransfer.items[0].getAsFile());
        done();
      });
      component.onFileDrop(dragEvent as any);
    });

    it('should do nothing for no item', () => {
      const dragEvent = {
        preventDefault() {},
        dataTransfer: {
          items: [],
        },
      };
      spyOn<any>(component, 'removeDragData').and.stub();
      const res = component.onFileDrop(dragEvent as any);
      expect(res).toEqual(undefined);
    });

    it('should fallback to file when no items', (done: Function) => {
      const dragEvent = {
        preventDefault() {},
        dataTransfer: {
          files: [
            {
              name: 'mock.sketch',
            },
          ],
        },
      };
      component.changed.subscribe((element) => {
        expect(element).toEqual(dragEvent.dataTransfer.files[0]);
        done();
      });
      component.onFileDrop(dragEvent as any);
    });
  });
});
