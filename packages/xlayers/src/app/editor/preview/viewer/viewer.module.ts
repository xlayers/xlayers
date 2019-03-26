import { NgModule } from '@angular/core';
import { CoreModule } from '@app/core/core.module';
import { SketchParserModule } from '@xlayers/sketchapp-parser';
import { SketchCanvasComponent } from './sketch-canvas/sketch-canvas.component';
import { SketchContainerComponent } from './sketch-container/sketch-container.component';
import { SketchSelectedLayerDirective } from './sketch-layer/selected-layer.directive';
import { SketchLayerComponent } from './sketch-layer/sketch-layer.component';
import { SketchPageComponent } from './sketch-page/sketch-page.component';
import { SketchStopEventPropagationDirective } from './sketch-stop-event-propagation.directive';
import { SketchTooltilDirective } from './sketch-tooltip.directive';
import { Xly3dRotationDirective } from './3d-rotation.directive';

@NgModule({
  imports: [CoreModule, SketchParserModule],
  declarations: [
    SketchCanvasComponent,
    SketchContainerComponent,
    SketchPageComponent,
    SketchLayerComponent,
    SketchStopEventPropagationDirective,
    SketchSelectedLayerDirective,
    SketchTooltilDirective,
    Xly3dRotationDirective
  ],
  exports: [
    SketchCanvasComponent,
    SketchContainerComponent,
    SketchSelectedLayerDirective
  ]
})
export class ViewerModule {}
