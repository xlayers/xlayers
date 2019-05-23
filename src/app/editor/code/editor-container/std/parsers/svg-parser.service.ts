import { Injectable } from "@angular/core";
import { CodeGenRessourceFile, ParserFacade } from "../core.service";

@Injectable({
  providedIn: "root"
})
export class SvgParserService implements ParserFacade {
  transform(_data: SketchMSData, current: SketchMSLayer, _options?: any) {
    if (this.getInfo(current)) {
      return [
        {
          kind: "svg",
          language: "svg",
          value: this.getInfo(current),
          uri: current.name + ".svg"
        } as CodeGenRessourceFile
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

  getInfo(current: SketchMSLayer) {
    return (current as any).svg || (current as any).shape;
  }
}
