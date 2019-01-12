import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsModule, Store } from '@ngxs/store';
import { UiState } from 'src/app/core/state';
import { CodeGenState, CodeGenSettings } from 'src/app/core/state/page.state';
import { EditorContainerComponent } from './editor-container.component';
import { CodeGenService } from './codegen/codegen.service';

const codeGenService = {
  generate() { return []; }
};

describe('EditorContainerComponent', () => {
  let component: EditorContainerComponent;
  let fixture: ComponentFixture<EditorContainerComponent>;
  let store: Store;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        NgxsModule.forRoot([UiState, CodeGenState]),
        MatMenuModule,
        MatSnackBarModule
      ],
      providers: [
        {
          provide: CodeGenService,
          useValue: codeGenService
        }
      ],
      declarations: [EditorContainerComponent]
    }).compileComponents();

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorContainerComponent);
    component = fixture.componentInstance;
    component.files = [];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    store.selectOnce(state => state.codegen).subscribe((codegen: CodeGenSettings) => {
      expect(codegen.content).toBe([]);
      expect(codegen.kind).toBe(1 /* CodeGenService.Kind.Angular */ );
    });
  });
});
