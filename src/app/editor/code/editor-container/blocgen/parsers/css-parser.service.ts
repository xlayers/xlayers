import { Injectable } from "@angular/core";
import { ParserFacade } from "../blocgen";

@Injectable({
  providedIn: "root"
})
export class CssParserService implements ParserFacade {
  transform(data: SketchMSData, current: SketchMSLayer) {
    return [];
  }

  identify(current: SketchMSLayer) {
    return (
      (current._class as string) === "rect" ||
      (current._class as string) === "page" ||
      (current._class as string) === "rectangle" ||
      (current._class as string) === "group"
    );
  }

  getInfo(current: SketchMSLayer) {
    const isLegacyCss =
      current.css && (!current.css.rule && !current.css.className);

    return {
      rules: current.css,
      className: isLegacyCss
        ? (current as any).css__className
        : (current as any).className
    };
  }
}
