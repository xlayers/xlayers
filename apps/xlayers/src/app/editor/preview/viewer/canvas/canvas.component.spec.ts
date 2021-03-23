import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ViewerCanvasComponent } from './canvas.component';
import { NO_ERRORS_SCHEMA, Renderer2 } from '@angular/core';
import { NgxsModule, Store } from '@ngxs/store';
import { getSketchDataMock } from '../../../../core/sketch.service.mock';
import { getFlatLayerMock } from '../layer/layer.component.mock';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CodeGenState } from '../../../../core/state/page.state';
import { UiState, CurrentData } from '../../../../core/state';

const renderer2Value = {
  addClass(k, v) {},
  removeClass(k, v) {},
};

describe('ViewerCanvasComponent', () => {
  let component: ViewerCanvasComponent;
  let fixture: ComponentFixture<ViewerCanvasComponent>;
  let store: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          NgxsModule.forRoot([UiState, CodeGenState]),
          MatSnackBarModule,
          NoopAnimationsModule,
        ],
        declarations: [ViewerCanvasComponent],
        providers: [
          {
            provide: Renderer2,
            useValue: renderer2Value,
          },
        ],
      }).compileComponents();
      store = TestBed.inject(Store);
    })
  );

  beforeEach(
    waitForAsync(async () => {
      fixture = TestBed.createComponent(ViewerCanvasComponent);
      component = fixture.componentInstance;
      component.data = getSketchDataMock();
      component.currentPage = getFlatLayerMock();
      // fixture.detectChanges();
      await fixture.whenStable();
    })
  );

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('it toggles currentData', () => {
    store.dispatch(new CurrentData(getSketchDataMock()));
    store.selectOnce(UiState.currentData).subscribe((currentData) => {
      expect(currentData).toBeTruthy();
    });
  });

  it('should have current page', () => {
    expect(component.data.pages[0]).toBeTruthy();
    expect(component.currentPage).toBeTruthy();
  });
});
