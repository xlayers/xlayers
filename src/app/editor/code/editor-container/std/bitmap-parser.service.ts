import { Injectable } from "@angular/core";
import { ParserFacade } from "./core-parser.service";

@Injectable({
  providedIn: "root"
})
export class BitmapParserService implements ParserFacade {
  transform(data: SketchMSData, current: SketchMSLayer, _options?: any) {
    if ((current as any).image._class === "MSJSONFileReference") {
      return [
        {
          kind: "bitmap",
          language: "base64",
          value: this.getLayerImage(data, current),
          uri: name + ".png"
        }
      ];
    }

    return [];
  }

  identify(current: SketchMSLayer) {
    return (current._class as string) === "bitmap";
  }

  getInfo(current: SketchMSLayer) {
    return (current as any).bitmap;
  }

  private getLayerImage(data: SketchMSData, current: SketchMSLayer) {
    return this.getImageDataFromRef(data, (current as any).image._ref)
      .source;
  }

  private getImageDataFromRef(data: SketchMSData, reference: string) {
    return (data.document as any).bitmap.images[reference];
  }
}
