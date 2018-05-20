import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { AngularSketchModule } from 'projects/manekinekko/ngx-sketch-viewer/src/public_api';

const MatModules = [MatSidenavModule, MatIconModule, MatButtonModule, MatToolbarModule];

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, MatModules, AngularSketchModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
