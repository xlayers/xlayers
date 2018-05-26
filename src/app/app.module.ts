import { LayerSettingsModule } from './layer-settings/layer-settings.module';
import { UiState } from './state/ui.state';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { AppComponent } from './app.component';
import { AngularSketchModule } from 'projects/manekinekko/ngx-sketch-viewer/src/public_api';
import { CoreModule } from './core/core.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CoreModule,
    BrowserAnimationsModule,
    NgxsModule.forRoot([UiState]),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    AngularSketchModule,
    LayerSettingsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
