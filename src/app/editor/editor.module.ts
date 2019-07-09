import { ErrorHandler, NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from '@app/core/core.module';
import { ErrorReportService } from '../core/error-report.service';
import { EditorComponent } from './editor.component';

export const routes: Route[] = [
  {
    path: '',
    component: EditorComponent,
    children: [
      {
        path: 'code',
        loadChildren: './code/code.module#CodeModule'
      },
      {
        path: 'preview',
        loadChildren: './preview/preview.module#PreviewModule'
      }
    ]
  }
];

@NgModule({
  imports: [CoreModule, RouterModule.forChild(routes)],
  declarations: [EditorComponent],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorReportService
    }
  ]
})
export class EditorModule {}
