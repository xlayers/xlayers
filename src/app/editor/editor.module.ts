import { SourceCodeService } from './source-code.service';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor/editor.component';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { CoreModule } from 'src/app/core/core.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    NoopAnimationsModule,
    MonacoEditorModule.forRoot()
  ],
  declarations: [EditorComponent],
  exports: [EditorComponent],
  providers: [SourceCodeService]
})
export class EditorModule { }
