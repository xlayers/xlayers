import { Route, RouterModule } from '@angular/router';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from './../core/core.module';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { LayerSettingsModule } from './layer-settings/layer-settings.module';
import { AngularSketchModule } from './viewer/lib/sketch.module';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { UiState } from 'src/app/core/state/ui.state';
import { NgxsModule } from '@ngxs/store';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditorComponent } from './editor.component';

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
    LayerSettingsModule
  ],
  declarations: [EditorComponent, TreeViewComponent]
})
export class EditorModule {}
