import { CoreModule } from './../core/core.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsContainerComponent } from './settings-container/settings-container.component';
import { SettingsLayerComponent } from './settings-layer/settings-layer.component';
import { SettingsLayerPropertiesComponent } from './settings-layer-properties/settings-layer-properties.component';
import { SettingsLayerColorsComponent } from './settings-layer-colors/settings-layer-colors.component';

@NgModule({
  imports: [CommonModule, CoreModule],
  declarations: [SettingsContainerComponent, SettingsLayerComponent, SettingsLayerPropertiesComponent, SettingsLayerColorsComponent],
  exports: [SettingsContainerComponent]
})
export class LayerSettingsModule {}
