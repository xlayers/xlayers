import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SketchCanvasComponent } from './sketch-canvas.component';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { getSketchDataMock } from './sketch.service.mock';
import { UiState, CurrentFile } from '@app/core/state';
import { CodeGenState } from '@app/core/state/page.state';
import { getFlatLayerMock } from './sketch-layer.component.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

const renderer2Value = {
  addClass(k, v) {},
  removeClass(k, v) {},
};

describe('SketchCanvasComponent', () => {
  let component: SketchCanvasComponent;
  let fixture: ComponentFixture<SketchCanvasComponent>;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, CodeGenState]),
        MatSnackBarModule,
        NoopAnimationsModule
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it toggles currentFile', () => {
    store.dispatch(new CurrentFile(getSketchDataMock()));
    store.selectOnce(UiState.currentFile).subscribe(currentFile => {
      expect(currentFile).toBeTruthy();
    });
  });

  it('should have current page', () => {
    expect(component.data.pages[0]).toBeTruthy();
    expect(component.currentPage).toBeTruthy();
  });
});
