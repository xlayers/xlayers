import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { UiState } from 'src/app/core/state/ui.state';
import { CodeEditorModule } from 'src/app/editor/code-editor/code-editor.module';
import { CoreModule } from './../core/core.module';
import { EditorComponent } from './editor.component';
import { LayerSettingsModule } from './layer-settings/layer-settings.module';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { AngularSketchModule } from './viewer/lib/sketch.module';

export const routes: Route[] = [
  {
    path: '',
    component: EditorComponent
  }
];

@NgModule({
  imports: [
    CoreModule,
    NgxsModule.forRoot([UiState]),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    RouterModule.forChild(routes),
    AngularSketchModule,
    LayerSettingsModule,
    CodeEditorModule
  ],
  declarations: [EditorComponent, TreeViewComponent]
})
export class EditorModule {}
