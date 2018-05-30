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
import { SketchSelectedLayerDirective } from './selected-layer.directive';
import { CoreModule } from './../../core/core.module';
import { SketchStopEventPropagationDirective } from './sketch-stop-event-propagation.directive';

@NgModule({
  imports: [CommonModule, CoreModule],
  declarations: [
    SketchCanvasComponent,
    SketchDropzoneComponent,
    SketchContainerComponent,
    SketchPageComponent,
    SketchLayerComponent,
    SketchStopEventPropagationDirective,
    SketchSelectedLayerDirective
  ],
  exports: [SketchCanvasComponent, SketchDropzoneComponent, SketchContainerComponent, SketchSelectedLayerDirective]
})
export class AngularSketchModule {}
