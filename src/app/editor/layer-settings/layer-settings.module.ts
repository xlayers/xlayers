import { NgModule } from '@angular/core';
import { CoreModule } from 'src/app/core/core.module';
import { SettingsContainerComponent } from './settings-container/settings-container.component';
import { SettingsLayerColorsComponent } from './settings-layer-colors/settings-layer-colors.component';
import { SettingsLayerPositionComponent } from './settings-layer-position/settings-layer-position.component';
import { SettingsLayerPropertiesComponent } from './settings-layer-properties/settings-layer-properties.component';

@NgModule({
  imports: [CoreModule],
  declarations: [
    SettingsContainerComponent,
    SettingsLayerPositionComponent,
    SettingsLayerPropertiesComponent,
    SettingsLayerColorsComponent
  ],
  exports: [SettingsContainerComponent]
})
export class LayerSettingsModule {}
