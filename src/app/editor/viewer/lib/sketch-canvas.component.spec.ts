import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SketchCanvasComponent } from './sketch-canvas.component';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { getSketchDataMock } from './sketch.service.mock';
import { UiState, CurrentFile } from 'src/app/core/state';
import { PageState } from 'src/app/core/state/page.state';
import { getFlatLayerMock } from './sketch-layer.component.mock';

const renderer2Value = {
  addClass(k,v) {},
  removeClass(k,v) {},
}

describe('SketchCanvasComponent', () => {
  let component: SketchCanvasComponent;
  let fixture: ComponentFixture<SketchCanvasComponent>;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, PageState]),
        MatSnackBarModule,
      ],
      declarations: [SketchCanvasComponent],
      providers: [{
        provide: Renderer2,
        useValue: renderer2Value
      }]
    })
      .compileComponents();
      store = TestBed.get(Store);
  }));

  beforeEach(async() => {
    fixture = TestBed.createComponent(SketchCanvasComponent);
    component = fixture.componentInstance;
    component.data = getSketchDataMock();
    component.currentPage = getFlatLayerMock();
    // fixture.detectChanges();
    await fixture.whenStable();
  });

  fit('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it toggles currentFile', async(() => {
    store.dispatch(new CurrentFile(getSketchDataMock()));
    store.selectOnce(UiState.currentFile).subscribe(currentFile => {
      expect(currentFile).toBe(true);
    });
  }));

  it('should be a preview', () => {
    expect(component.isPreview).toBeTruthy();
  });

  it('should have current page', () => {
    expect(component.data.pages[0]).toBeTruthy();
    expect(component.currentPage).toBeTruthy();
  });
});
