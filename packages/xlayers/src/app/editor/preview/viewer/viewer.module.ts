import { NgModule } from '@angular/core';
import { CoreModule } from '@app/core/core.module';
import { SketchParserModule } from '@xlayers/sketchapp-parser';
import { CanvasComponent } from './canvas/canvas.component';
import { ContainerComponent } from './container/container.component';
import { SelectedLayerDirective } from './layer/selected-layer.directive';
import { LayerComponent } from './layer/layer.component';
import { PageComponent } from './page/page.component';
import { StopEventPropagationDirective } from './stop-event-propagation.directive';
import { TooltilDirective } from './tooltip.directive';
import { Xly3dRotationDirective } from './3d-rotation.directive';

@NgModule({
  imports: [CoreModule, SketchParserModule],
  declarations: [
    CanvasComponent,
    ContainerComponent,
    PageComponent,
    LayerComponent,
    StopEventPropagationDirective,
    SelectedLayerDirective,
    TooltilDirective,
    Xly3dRotationDirective
  ],
  exports: [
    CanvasComponent,
    ContainerComponent,
    SelectedLayerDirective
  ]
})
export class ViewerModule {}
