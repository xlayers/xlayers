import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegistryService {
  identifyBitmap(current: SketchMSLayer) {
    return (current._class as string) === 'bitmap';
  }

  lookupBitmap(current: SketchMSLayer, data: SketchMSData) {
    return this.getImageDataFromRef(data, (current as any).image._ref);
  }

  private getImageDataFromRef(data: SketchMSData, reference: string) {
    const bitmaps = this.bitmapRegistryOf(data);
    return bitmaps[reference];
  }

  private bitmapRegistryOf(data: SketchMSData) {
    const legacyResourceRegistry =
      (data as any).resources &&
      (data as any).resources.images &&
      Object.entries((data as any).resources.images).reduce(
        (acc, [relativePath, image]) => ({
          ...acc,
          [relativePath]: (image as any).source
        }),
        {}
      );

    return legacyResourceRegistry || (data as any).images;
  }
}
