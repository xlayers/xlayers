import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SketchService } from '@app/core/sketch.service';
import { UiState } from '@app/core/state';
import { CodeGenState } from '@app/core/state/page.state';
import { NgxsModule, Store } from '@ngxs/store';
import { ViewerContainerComponent } from './container.component';


fdescribe('ViewerContainerComponent', () => {
  let component: ViewerContainerComponent;
  let fixture: ComponentFixture<ViewerContainerComponent>;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, CodeGenState]),
        MatSnackBarModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [{
        provide: SketchService,
        useValue: {}
      }],
      declarations: [ViewerContainerComponent]
    }).compileComponents();
    store = TestBed.get(Store);
  }));

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
      component.currentPage = {} as any;
      component.clearSelection();
      store.select(UiState.currentLayer).subscribe(element => {
        expect(element).toBe(null);
      });
    }));

    it('currentPage is falsy', async(() => {
      component.currentPage = null;
      component.clearSelection();
      store.select(UiState.currentLayer).subscribe(element => {
        expect(element).toBe(null);
      });
    }));
  });
});
