import { EditorContainerComponent } from './editor-container/editor-container.component';
import { NgModule } from '@angular/core';
import { CoreModule } from '~core/src/app/core/core.module';
import { CodeGenModule } from './editor-container/codegen/codegen.module';
import { HighlightModule } from 'ngx-highlightjs';

@NgModule({
  imports: [CoreModule, CodeGenModule, HighlightModule],
  declarations: [EditorContainerComponent],
  exports: [EditorContainerComponent]
})
export class CodeEditorModule {}
