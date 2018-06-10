import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsModule } from '@ngxs/store';
import { UiState } from 'src/app/core/state';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { EditorModule } from './editor/editor.module';
import { LayerSettingsModule } from './layer-settings/layer-settings.module';
import { TreeViewComponent } from './tree-view/tree-view.component';
import { AngularSketchModule } from './viewer/lib/sketch.module';


@NgModule({
  declarations: [AppComponent, TreeViewComponent],
  imports: [
    BrowserModule,
    CoreModule,
    NoopAnimationsModule,
    NgxsModule.forRoot([UiState]),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    AngularSketchModule,
    LayerSettingsModule,
    EditorModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
