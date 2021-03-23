import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  async,
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NgxsModule, Store } from '@ngxs/store';
import { SketchService } from '../../../../core/sketch.service';
import { UiState } from '../../../../core/state';
import { CodeGenState } from '../../../../core/state/page.state';
import { ViewerContainerComponent } from './container.component';

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
    it('currentPage is truthy', async(() => {
      component.data = {} as any;
      component.clearSelection();
      store.select(UiState.currentLayer).subscribe((element) => {
        expect(element).toBe(null);
      });
    }));

    it('currentPage is falsy', async(() => {
      component.data = null;
      component.clearSelection();
      store.select(UiState.currentLayer).subscribe((element) => {
        expect(element).toBe(null);
      });
    }));
  });
});
