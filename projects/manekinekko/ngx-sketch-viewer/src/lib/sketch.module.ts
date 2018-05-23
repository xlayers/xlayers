import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SketchContainerComponent } from './sketch-container.component';
import { SketchCanvasComponent } from './sketch-canvas.component';
import { SketchDropzoneComponent } from './sketch-dropzone.component';
import { SketchLayerComponent } from './sketch-layer.component';
import { SketchPageComponent } from './sketch-page.component';

@NgModule({
  imports: [CommonModule, MatTooltipModule, MatIconModule, MatButtonModule],
  declarations: [SketchCanvasComponent, SketchDropzoneComponent, SketchContainerComponent, SketchPageComponent, SketchLayerComponent],
  exports: [SketchCanvasComponent, SketchDropzoneComponent, SketchContainerComponent]
})
export class AngularSketchModule {}
