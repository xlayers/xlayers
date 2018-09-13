import { CodeEditorModule } from './code-editor.module';

describe('CodeEditorModule', () => {
  let codeEditorModule: CodeEditorModule;

  beforeEach(() => {
    codeEditorModule = new CodeEditorModule();
  });

  it('should create an instance', () => {
    expect(codeEditorModule).toBeTruthy();
  });
});
