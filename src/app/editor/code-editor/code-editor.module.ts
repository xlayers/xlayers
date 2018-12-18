import { EditorContainerComponent } from './editor-container/editor-container.component';
import { NgModule } from '@angular/core';
import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { CoreModule } from 'src/app/core/core.module';
import { CodeGenModule } from './editor-container/codegen/codegen.module';

export function onMonacoLoad() {
  monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
    noSemanticValidation: true,
    noSyntaxValidation: true
  });
  monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
    target: monaco.languages.typescript.ScriptTarget.ES2016,
    allowNonTsExtensions: true,
    moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
    module: monaco.languages.typescript.ModuleKind.CommonJS,
    noEmit: true,
    typeRoots: ['node_modules/@types']
  });
}
export const monacoConfig: NgxMonacoEditorConfig = {
  defaultOptions: {
    theme: 'vs-dark',
    automaticLayout: true, // Warning: this might have a severe performance impact,
    fontSize: 15,
    fontLigatures: true,
    formatOnPaste: false,
    scrollBeyondLastLine: true,
    miniMap: {
      enabled: false
    }
  },
  onMonacoLoad
};

@NgModule({
  imports: [CoreModule, CodeGenModule, MonacoEditorModule.forRoot(monacoConfig)],
  declarations: [EditorContainerComponent],
  exports: [EditorContainerComponent]
})
export class CodeEditorModule {}
