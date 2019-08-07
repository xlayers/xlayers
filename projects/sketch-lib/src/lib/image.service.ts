import { Injectable } from '@angular/core';
import { FormatService } from './format.service';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  constructor(private format: FormatService) {}

  identify(current: SketchMSLayer) {
    return (current._class as string) === 'bitmap';
  }

  lookup(current: SketchMSLayer, data: SketchMSData) {
    return this.getImageDataFromRef(data, (current as any).image._ref);
  }

  render(current: SketchMSLayer, data: SketchMSData, options: any) {
    const content = this.getImageDataFromRef(data, (current as any).image._ref);
    const bin = atob(content);
    const buf = new Uint8Array(bin.length);
    Array.prototype.forEach.call(bin, (ch, i) => {
      buf[i] = ch.charCodeAt(0);
    });

    return [
      {
        kind: 'file',
        value: buf,
        language: 'binary',
        uri: `${options.assetDir}/${this.format.normalizeName(
          current.name
        )}.png`
      }
    ];
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
