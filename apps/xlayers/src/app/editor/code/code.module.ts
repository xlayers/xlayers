import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { HighlightModule } from 'ngx-highlightjs';
import { CodeComponent } from './code.component';
import { CodeGenModule } from './editor-container/codegen/codegen.module';
import { EditorContainerComponent } from './editor-container/editor-container.component';
import { CoreModule } from '../../core/core.module';

export const routes: Route[] = [
  {
    path: '',
    component: CodeComponent,
  },
];

@NgModule({
  imports: [
    CoreModule,
    CodeGenModule,
    HighlightModule,
    RouterModule.forChild(routes),
  ],
  declarations: [EditorContainerComponent, CodeComponent],
  exports: [EditorContainerComponent],
})
export class CodeModule {}
