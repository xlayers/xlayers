import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SketchCanvasComponent } from './sketch-canvas.component';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { getSketchDataMock } from './sketch.service.mock';
import { UiState } from 'src/app/core/state';
import { PageState } from 'src/app/core/state/page.state';
import { getFlatLayerMock } from './sketch-layer.component.mock';

describe('SketchCanvasComponent', () => {
  let component: SketchCanvasComponent;
  let fixture: ComponentFixture<SketchCanvasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, PageState]),
        MatSnackBarModule,
      ],
      declarations: [SketchCanvasComponent],
      providers: [Renderer2]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SketchCanvasComponent);
    component = fixture.componentInstance;
    component.data = getSketchDataMock();
    component.currentPage = getFlatLayerMock();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be a preview', () => {
    expect(component.isPreview).toBeTruthy();
  });

  it('should have current page', () => {
    expect(component.data.pages[0]).toBeTruthy();
    expect(component.currentPage).toBeTruthy();
  });
});
