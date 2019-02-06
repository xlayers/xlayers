import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsModule, Store } from '@ngxs/store';
import { UiState } from '../../../core/state';
import { CodeGenState, CodeGenSettings } from '../../../core/state/page.state';
import { EditorContainerComponent } from './editor-container.component';
import { CodeGenService, CodeGenKind } from './codegen/codegen.service';

const codeGenService = {
  generate() { return {
    content: [],
    kind: CodeGenKind.Angular,
    buttons: {},
  }; }
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
    component.codeSetting = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    store.selectOnce(state => state.codegen).subscribe((codegen: CodeGenSettings) => {
      expect(codegen.content).toEqual([]);
      expect(codegen.kind).toBe(CodeGenKind.Angular);
      expect(codegen.buttons.stackblitz).toBeTruthy();
    });
  });
});
