import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from '@app/core/core.module';
import { HighlightModule } from 'ngx-highlightjs';
import { CodeComponent } from './code.component';
import { CodeGenModule } from './editor-container/codegen/codegen.module';
import { EditorContainerComponent } from './editor-container/editor-container.component';

export const routes: Route[] = [
  {
    path: '',
    component: CodeComponent
  }
];

@NgModule({
  imports: [
    CoreModule,
    CodeGenModule,
    HighlightModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EditorContainerComponent, CodeComponent],
  exports: [EditorContainerComponent]
})
export class CodeModule {}
