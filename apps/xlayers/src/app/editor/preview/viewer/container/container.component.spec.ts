import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgxsModule, Store } from '@ngxs/store';
import { ViewerContainerComponent } from './container.component';
import { UiState } from '../../../../core/state';
import { CodeGenState } from '../../../../core/state/page.state';
import { SketchService } from '../../../../core/sketch.service';

describe('ViewerContainerComponent', () => {
  let component: ViewerContainerComponent;
  let fixture: ComponentFixture<ViewerContainerComponent>;
  let store: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          NgxsModule.forRoot([UiState, CodeGenState]),
          MatSnackBarModule,
          HttpClientTestingModule,
          NoopAnimationsModule,
        ],
        providers: [
          {
            provide: SketchService,
            useValue: {},
          },
        ],
        declarations: [ViewerContainerComponent],
      }).compileComponents();
      store = TestBed.inject(Store);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('should clear current page', () => {
    it(
      'currentPage is truthy',
      waitForAsync(() => {
        component.data = {} as any;
        component.clearSelection();
        store.select(UiState.currentLayer).subscribe((element) => {
          expect(element).toBe(null);
        });
      })
    );

    it(
      'currentPage is falsy',
      waitForAsync(() => {
        component.data = null;
        component.clearSelection();
        store.select(UiState.currentLayer).subscribe((element) => {
          expect(element).toBe(null);
        });
      })
    );
  });
});
