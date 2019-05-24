import { Injectable } from "@angular/core";
import { RessourceFile, ParserFacade } from "../blocgen";

export interface SvgParserOptions {}

@Injectable({
  providedIn: "root"
})
export class SvgParserService implements ParserFacade {
  transform(
    _data: SketchMSData,
    current: SketchMSLayer,
    _options?: SvgParserOptions
  ) {
    if (this.getInfos(current)) {
      return [
        {
          kind: "svg",
          language: "svg",
          value: this.getInfos(current),
          uri: current.name + ".svg"
        } as RessourceFile
      ];
    }
    return [];
  }

  identify(current: SketchMSLayer) {
    return (
      (current._class as string) === "shapePath" ||
      (current._class as string) === "shapeGroup"
    );
  }

  getInfos(current: SketchMSLayer) {
    return (current as any).svg || (current as any).shape;
  }
}
