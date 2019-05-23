import { Injectable } from "@angular/core";
import { ParserFacade } from "../core.service";

@Injectable({
  providedIn: "root"
})
export class BitmapParserService implements ParserFacade {
  transform(data: SketchMSData, current: SketchMSLayer, _options?: any) {
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
    return (current._class as string) === "bitmap";
  }

  getInfo(current: SketchMSLayer) {
    return (current as any).bitmap;
  }

  private getLayerImage(data: SketchMSData, current: SketchMSLayer) {
    return this.getImageDataFromRef(data, (current as any).image._ref);
  }

  private getImageDataFromRef(data: SketchMSData, reference: string) {
    return (data as any).images[reference];
  }
}
