import { CodeEditorModule } from './code-editor.module';

describe('EditorModule', () => {
  let editorModule: CodeEditorModule;

  beforeEach(() => {
    editorModule = new CodeEditorModule();
  });

  it('should create an instance', () => {
    expect(editorModule).toBeTruthy();
  });
});
