import { ErrorHandler, NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { UiState } from '~core/src/app/core/state/ui.state';
import { CodeEditorModule } from './code-editor/code-editor.module';
import { CodeGenState } from '~core/src/app/core/state/page.state';
import { CoreModule } from '~core/src/app/core/core.module';
import { EditorComponent } from './editor.component';
import { ErrorReportService } from './error-report.service';
import { LayerSettingsModule } from './layer-settings/layer-settings.module';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { AngularSketchModule } from './viewer/lib/sketch.module';
import { environment } from '~core/src/environments/environment';

export const routes: Route[] = [
  {
    path: '',
    component: EditorComponent
  }
];

@NgModule({
  imports: [
    CoreModule,
    NgxsModule.forRoot([UiState, CodeGenState], { developmentMode: !environment.production }),
    NgxsLoggerPluginModule.forRoot({ disabled: environment.production }),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }) ,
    RouterModule.forChild(routes),
    AngularSketchModule,
    LayerSettingsModule,
    CodeEditorModule
  ],
  declarations: [EditorComponent, TreeViewComponent],
  providers: [
    {
      provide: ErrorHandler,
      useClass: ErrorReportService
    }
  ]
})
export class EditorModule {}
