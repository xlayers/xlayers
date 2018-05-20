import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SketchContainerComponent } from './sketch-container.component';
import { SketchViewerComponent } from './sketch-viewer.component';
import { SketchDropzoneComponent } from './sketch-dropzone.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule],
  declarations: [SketchViewerComponent, SketchDropzoneComponent, SketchContainerComponent],
  exports: [SketchContainerComponent]
})
export class AngularSketchModule {}
