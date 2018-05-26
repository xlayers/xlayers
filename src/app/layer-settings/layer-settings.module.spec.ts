import { LayerSettingsModule } from './layer-settings.module';

describe('LayerSettingsModule', () => {
  let layerSettingsModule: LayerSettingsModule;

  beforeEach(() => {
    layerSettingsModule = new LayerSettingsModule();
  });

  it('should create an instance', () => {
    expect(layerSettingsModule).toBeTruthy();
  });
});
