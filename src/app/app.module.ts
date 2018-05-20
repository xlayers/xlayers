import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AngularSketchViewerModule } from '@manekinekko/ngx-sketch-viewer';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, BrowserAnimationsModule, AngularSketchViewerModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
