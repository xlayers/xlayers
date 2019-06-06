import { Injectable } from '@angular/core';

export interface BitmapParserContext {}

@Injectable({
  providedIn: 'root'
})
export class BitmapContextService {
  identify(current: SketchMSLayer) {
    return ['bitmap'].includes(current._class as string);
  }

  hasGlobalContext(data: SketchMSData) {
    const hasLegacyContext =
      (data as any).resources && (data as any).resources.images;
    return hasLegacyContext || (data as any).images;
  }

  globalContextOf(data: SketchMSData) {
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
