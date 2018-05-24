import { UiState } from './state/ui.state';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';

import { NgxsModule } from '@ngxs/store';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

import { AppComponent } from './app.component';
import { AngularSketchModule } from 'projects/manekinekko/ngx-sketch-viewer/src/public_api';
import { FormsModule } from '@angular/forms';

const MatModules = [
  MatExpansionModule,
  MatSlideToggleModule,
  MatListModule,
  MatSidenavModule,
  MatIconModule,
  MatButtonModule,
  MatToolbarModule,
  MatInputModule
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    MatModules,
    NgxsModule.forRoot([UiState]),
    NgxsLoggerPluginModule.forRoot(),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    AngularSketchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
