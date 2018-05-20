import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SketchContainerComponent } from './sketch-container.component';
import { SketchPreviewComponent } from './sketch-preview.component';
import { SketchDropzoneComponent } from './sketch-dropzone.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [CommonModule, MatIconModule, MatButtonModule],
  declarations: [SketchPreviewComponent, SketchDropzoneComponent, SketchContainerComponent],
  exports: [SketchPreviewComponent, SketchDropzoneComponent, SketchContainerComponent]
})
export class AngularSketchModule {}
