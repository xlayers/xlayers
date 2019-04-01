import { NgModule } from '@angular/core';
import { CoreModule } from '@app/core/core.module';
import { SketchParserModule } from '@xlayers/sketchapp-parser';
import { ViewerCanvasComponent } from './canvas/canvas.component';
import { ViewerContainerComponent } from './container/container.component';
import { ViewerSelectedLayerDirective } from './layer/selected-layer.directive';
import { ViewerLayerComponent } from './layer/layer.component';
import { ViewerPageComponent } from './page/page.component';
import { StopEventPropagationDirective } from './stop-event-propagation.directive';
import { TooltilDirective } from './tooltip.directive';
import { Xly3dRotationDirective } from './3d-rotation.directive';

@NgModule({
  imports: [CoreModule, SketchParserModule],
  declarations: [
    ViewerCanvasComponent,
    ViewerContainerComponent,
    ViewerPageComponent,
    ViewerLayerComponent,
    StopEventPropagationDirective,
    ViewerSelectedLayerDirective,
    TooltilDirective,
    Xly3dRotationDirective
  ],
  exports: [
    ViewerCanvasComponent,
    ViewerContainerComponent,
    ViewerSelectedLayerDirective
  ]
})
export class ViewerModule {}
