import { Injectable } from '@angular/core';
import { BitmapContextService } from './bitmap-context.service';

@Injectable({
  providedIn: 'root'
})
export class BitmapRenderService {
  constructor(private bitmapContextService: BitmapContextService) {}

  render(current: SketchMSLayer, data?: SketchMSData) {
    if (this.bitmapContextService.hasGlobalContext(data)) {
      return [
        {
          kind: 'bitmap',
          language: 'base64',
          value: this.getLayerImage(data, current),
          uri: `${name}.png`
        }
      ];
    }

    return [];
  }

  private getLayerImage(data: SketchMSData, current: SketchMSLayer) {
    return this.getImageDataFromRef(data, (current as any).image._ref);
  }

  private getImageDataFromRef(data: SketchMSData, reference: string) {
    const images = this.bitmapContextService.globalContextOf(data);
    return images[reference];
  }
}
