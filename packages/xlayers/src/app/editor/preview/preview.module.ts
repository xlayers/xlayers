import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CoreModule } from '@app/core/core.module';
import { LayerSettingsModule } from './layer-settings/layer-settings.module';
import { TreeViewComponent } from './layer-tree-layout/layer-tree-layout.component';
import { PreviewComponent } from './preview.component';
import { ViewerModule } from './viewer/viewer.module';

export const routes: Route[] = [
  {
    path: '',
    component: PreviewComponent
  }
];

@NgModule({
  declarations: [PreviewComponent, TreeViewComponent],
  imports: [
    CoreModule,
    LayerSettingsModule,
    ViewerModule,
    RouterModule.forChild(routes)
  ]
})
export class PreviewModule {}
