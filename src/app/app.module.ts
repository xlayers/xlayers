import { PageState } from './state/page.state';
import { LayerSettingsModule } from './layer-settings/layer-settings.module';
import { UiState } from './state/ui.state';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AngularSketchModule } from './viewer/lib/sketch.module';
import { TreeViewComponent } from './tree-view/tree-view.component';

@NgModule({
  declarations: [AppComponent, TreeViewComponent],
  imports: [
    BrowserModule,
    CoreModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([UiState, PageState]),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    AngularSketchModule,
    LayerSettingsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
