import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { NgxSketchViewerComponent } from './ngx-sketch-viewer.component';
import { NgxDropzoneComponent } from './ngx-dropzone.component';

@NgModule({
  imports: [MatIconModule, MatButtonModule],
  declarations: [NgxSketchViewerComponent, NgxDropzoneComponent],
  exports: [NgxSketchViewerComponent]
})
export class AngularSketchViewerModule {}
