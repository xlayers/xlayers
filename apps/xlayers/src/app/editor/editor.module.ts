import { ErrorHandler, NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ErrorReportService } from '../core/error-report.service';
import { EditorComponent } from './editor.component';
import { CoreModule } from '../core/core.module';

export const routes: Route[] = [
  {
    path: '',
    component: EditorComponent,
    children: [
      {
        path: 'code',
        loadChildren: () =>
          import('./code/code.module').then((m) => m.CodeModule),
      },
      {
        path: 'preview',
        loadChildren: () =>
          import('./preview/preview.module').then((m) => m.PreviewModule),
      },
    ],
  },
];

@NgModule({
  imports: [CoreModule, RouterModule.forChild(routes)],
  declarations: [EditorComponent],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorReportService,
    },
  ],
})
export class EditorModule {}
