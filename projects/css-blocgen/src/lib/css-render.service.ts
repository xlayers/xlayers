import { Injectable } from "@angular/core";
import { FormatService } from "@xlayers/sketch-lib";
import { CssContextService, CssBlocGenContext } from "./css-context.service";

@Injectable({
  providedIn: "root"
})
export class CssRenderService {
  constructor(
    private cssContext: CssContextService,
    private format: FormatService
  ) {}

  render(current: SketchMSLayer) {
    const context = this.cssContext.contextOf(current);
    return [
      {
        kind: "css",
        language: "css",
        value: this.renderFile(context),
        uri: `${this.format.fileName(current.name)}.css`
      }
    ];
  }

  private renderFile(context: CssBlocGenContext) {
    return this.rulesIntoKeyValue(context).join("\n");
  }

  private rulesIntoKeyValue(context: CssBlocGenContext) {
    return Object.entries(context.rules).map(
      ([key, value]) => `${key}: ${value};`
    );
  }
}
