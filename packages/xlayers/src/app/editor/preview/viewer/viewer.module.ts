import { NgModule } from '@angular/core';
import { CoreModule } from '@app/core/core.module';
import { SketchParserModule } from '@xlayers/sketchapp-parser';
import { SketchCanvasComponent } from './canvas/canvas.component';
import { SketchContainerComponent } from './container/container.component';
import { SketchSelectedLayerDirective } from './layer/selected-layer.directive';
import { SketchLayerComponent } from './layer/layer.component';
import { SketchPageComponent } from './page/page.component';
import { SketchStopEventPropagationDirective } from './stop-event-propagation.directive';
import { SketchTooltilDirective } from './tooltip.directive';

@NgModule({
  imports: [CoreModule, SketchParserModule],
  declarations: [
    SketchCanvasComponent,
    SketchContainerComponent,
    SketchPageComponent,
    SketchLayerComponent,
    SketchStopEventPropagationDirective,
    SketchSelectedLayerDirective,
    SketchTooltilDirective
  ],
  exports: [
    SketchCanvasComponent,
    SketchContainerComponent,
    SketchSelectedLayerDirective
  ]
})
export class ViewerModule {}
