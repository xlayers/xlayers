import { Injectable } from "@angular/core";
import { ParserFacade, WithGlobalContext } from "../blocgen";

export interface BitmapParserContext {}

export interface BitmapParserOptions {}

@Injectable({
  providedIn: "root"
})
export class BitmapParserService
  implements ParserFacade, WithGlobalContext<BitmapParserContext> {
  transform(
    data: SketchMSData,
    current: SketchMSLayer,
    _options: BitmapParserOptions = {}
  ) {
    return [
      {
        kind: "bitmap",
        language: "base64",
        value: this.getLayerImage(data, current),
        uri: name + ".png"
      }
    ];
  }

  identify(current: SketchMSLayer) {
    return ["bitmap"].includes(current._class as string);
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

  private getLayerImage(data: SketchMSData, current: SketchMSLayer) {
    return this.getImageDataFromRef(data, (current as any).image._ref);
  }

  private getImageDataFromRef(data: SketchMSData, reference: string) {
    const images = this.globalContextOf(data);
    return images && images[reference];
  }
}
