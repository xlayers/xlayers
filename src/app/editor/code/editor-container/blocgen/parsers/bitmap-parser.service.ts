import { Injectable } from "@angular/core";
import { RessourceParserFacade } from "../blocgen";

@Injectable({
  providedIn: "root"
})
export class BitmapParserService implements RessourceParserFacade {
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

  getResources(data: SketchMSData) {
    let legacyResourceRegistry =
      (data as any).resources &&
      (data as any).resources.images &&
      Object.entries((data as any).resources.images).map(
        ([relativePath, image]) => [relativePath, (image as any).source]
      );
    legacyResourceRegistry =
      legacyResourceRegistry &&
      (Object as any).fromEntries(legacyResourceRegistry);

    return legacyResourceRegistry || (data as any).images;
  }

  private getLayerImage(data: SketchMSData, current: SketchMSLayer) {
    return this.getImageDataFromRef(data, (current as any).image._ref);
  }

  private getImageDataFromRef(data: SketchMSData, reference: string) {
    const images = this.getResources(data);
    return images && images[reference];
  }
}
