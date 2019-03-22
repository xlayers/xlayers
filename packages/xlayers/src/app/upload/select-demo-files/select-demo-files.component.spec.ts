import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SketchSelectDemoFilesComponent } from './select-demo-files.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { HttpClientModule } from '@angular/common/http';
import { UiState } from '@app/core/state';
import { CodeGenState } from '@app/core/state/page.state';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SketchService } from '@app/core/sketch.service';

describe('SketchSelectDemoFilesComponent', () => {
  let component: SketchSelectDemoFilesComponent;
  let fixture: ComponentFixture<SketchSelectDemoFilesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, CodeGenState]),
        MatSnackBarModule,
        HttpClientModule
      ],
      providers: [SketchService],
      declarations: [SketchSelectDemoFilesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchSelectDemoFilesComponent);
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
