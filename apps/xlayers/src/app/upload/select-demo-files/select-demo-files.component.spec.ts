import { HttpClientModule } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsModule } from '@ngxs/store';
import { SketchService } from '../../core/sketch.service';
import { UiState } from '../../core/state';
import { CodeGenState } from '../../core/state/page.state';
import { SelectDemoFilesComponent } from './select-demo-files.component';

describe('SelectDemoFilesComponent', () => {
  let component: SelectDemoFilesComponent;
  let fixture: ComponentFixture<SelectDemoFilesComponent>;

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
        declarations: [SelectDemoFilesComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectDemoFilesComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should confirm select file', () => {
    fixture.detectChanges();
    const selectedDemoFile = 'some_file';
    component.confirmSelectedDemoFile(selectedDemoFile);
    component['changed'].subscribe((selectedDemoFileEvent) => {
      expect(selectedDemoFileEvent).toBe(selectedDemoFile);
    });
  });
});
