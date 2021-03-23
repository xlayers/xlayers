import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgxsModule, Store } from '@ngxs/store';
import { CodeGenSettings } from '../../../core/state/page.state';
import { XStore } from '../../../core/state/state.mock';
import { CodeGenKind, CodeGenService } from './codegen/codegen.service';
import { EditorContainerComponent } from './editor-container.component';

const codeGenService = {
  generate() {
    return {
      content: [],
      kind: CodeGenKind.Angular,
      buttons: {},
    };
  },
};

describe('EditorContainerComponent', () => {
  let component: EditorContainerComponent;
  let fixture: ComponentFixture<EditorContainerComponent>;
  let store: Store;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        schemas: [NO_ERRORS_SCHEMA],
        imports: [
          NgxsModule.forRoot([XStore]),
          MatMenuModule,
          MatSnackBarModule,
        ],
        providers: [
          {
            provide: CodeGenService,
            useValue: codeGenService,
          },
        ],
        declarations: [EditorContainerComponent],
      }).compileComponents();

      store = TestBed.inject(Store);
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorContainerComponent);
    component = fixture.componentInstance;
    component.codeSetting = {} as CodeGenSettings;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    store
      .selectOnce((state) => state.codegen)
      .subscribe((codegen: CodeGenSettings) => {
        expect(codegen.content).toEqual([]);
        expect(codegen.kind).toBe(CodeGenKind.Angular);
        expect(codegen.buttons.stackblitz).toBeTruthy();
      });
  });
});
